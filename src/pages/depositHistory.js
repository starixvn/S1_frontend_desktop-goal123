import React, { useEffect, useState, useRef, useContext } from "react";
import {
	api_payment_GetDepositInfoHistory,
	api_payment_SetDepositCancel
} from "../service/api/payment";
import { number_format, isConvert } from "../components/common/common";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../components/common/context";
import { TransactionHistory } from "../components/deposit/deposit.historyResult";
import { defPopBoxType } from "../components/common/popBox";
import { Pagination } from "../components/common/pagination";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import Filter from "../components/common/historyFilter";
import moment from "moment";
import LeftMenu from "../components/common/leftMenu";
import Loading from "../components/common/loading";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section className="inside">
						<LeftMenu />
						<div className="rightModule">
							<Content />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};

const Content = () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const [getHistory, setGetHistory] = useState(null);
	const [processing, setProcessing] = useState(false);
	const [filterData, setFilterData] = useState(null);
	const [pagination, setPagination] = useState({
		totalPages: 0,
		currentPage: 1
	});
	const [loading, setLoading] = useState(false);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const GetDepositInfoHistory = (transactionData, pageNumber) => {
		setLoading(true);

		api_payment_GetDepositInfoHistory({
			...transactionData,
			PageNumber: pageNumber
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setGetHistory(res.data.data);
						setPagination(prev => ({
							...prev,
							totalPages: res.data.totalPages
						}));
					} else {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
					setProcessing(false);
					setLoading(false);
				}
			},
			err => {
				if (isMountedRef.current) {
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={ClickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
					setProcessing(false);
					setLoading(false);
				}
			}
		);
	};

	const clickDateSubmit = (startDate, endDate, isUnix) => {
		if (!processing) {
			setProcessing(true);
			let transactionData = filterData;

			if (!isUnix) {
				transactionData = {
					StartDate: moment(startDate).unix(),
					EndDate: moment(endDate).endOf("day").unix()
				};
				setFilterData(transactionData);
			}
			setPagination(prev => ({ ...prev, currentPage: 1 }));
			GetDepositInfoHistory(transactionData, 1);
		}
	};

	const SubmitProof = (
		bankInfo,
		depositRep,
		amount,
		transId,
		picFileName,
		refId
	) => {
		let { currencyId, ...restBankInfo } = bankInfo;
		let { accountName, accountNo } = depositRep;
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.UploadBankSlip,
			depositTime: `${moment().format()}`,
			...restBankInfo,
			transId: transId,
			accountNo: accountNo,
			accountName: accountName,
			isOpen: true,
			amount: number_format(amount, _isConvert),
			picFileName: picFileName,
			refId: refId
		});
	};

	const ClickCancel = transId => {
		const ClickConfirm = () => {
			setLoading(true);
			setPopBox({ isOpen: false });

			api_payment_SetDepositCancel(transId).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setGetHistory(prevState => {
								let newD = [...prevState];
								let idx = newD.findIndex(
									x => x.transId === transId
								);
								newD[idx].status = 5;
								return newD;
							});
						}
						setLoading(false);
					}
				},
				err => {
					if (isMountedRef.current) {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: t("msg_ApiServerError"),
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
						setLoading(false);
					}
				}
			);
		};

		const ClosePopBox = () => {
			setPopBox({ isOpen: false });
		};

		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Cancel,
			btnBar: (
				<div className="btnGroup">
					<button className="btn-cancel" onClick={ClosePopBox}>
						{t("lbl_No")}
					</button>
					<button className="btn-check" onClick={ClickConfirm}>
						{t("lbl_Yes")}
					</button>
				</div>
			)
		});
	};

	const clickPageNumber = page => {
		if (!processing) {
			let transactionData = filterData;
			setProcessing(true);
			setPagination(prev => ({ ...prev, currentPage: page }));
			GetDepositInfoHistory(transactionData, page);
		}
	};

	let arr = getHistory?.map((item, i) => {
		return (
			<TransactionHistory
				key={`depositHistory-${item.transId}`}
				idx={i + 1}
				createTime={item.createTime}
				transId={item.transId}
				depositType={item.depositType}
				status={item.status}
				_isConvert={_isConvert}
				amount={item.amount}
				ClickCancel={ClickCancel.bind(this, item.transId)}
				SubmitProof={SubmitProof.bind(
					this,
					item.bankInfo,
					item.depositRep,
					item.amount,
					item.transId,
					item.picFileName,
					item.refId
				)}
			/>
		);
	});

	return loading ? (
		<Loading />
	) : (
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_History">
				<span>{t("lbl_DepositHistory")}</span>
			</div>
			<Filter submitHandler={clickDateSubmit} />

			{getHistory ? (
				getHistory.length > 0 ? (
					<div className="list history">
						<div className="listHeader">
							<div>{t("lbl_NO")}</div>
							<div>
								{t("lbl_Date")} ({moment().format("Z")})
							</div>
							<div>{t("lbl_ID")}</div>
							<div>{t("lbl_Method")}</div>
							<div>{t("lbl_Amount")}</div>
							<div>{t("lbl_Status")}</div>
							<div>
								{t("lbl_Action")}
								<button
									className="icon icon-spinner11"
									onClick={clickDateSubmit.bind(
										this,
										filterData.StartDate,
										filterData.EndDate
									)}></button>
							</div>
						</div>
						<div className="listBody">{arr}</div>
					</div>
				) : (
					<div className="nodata">{t("msg_NoData")}</div>
				)
			) : null}

			{pagination.totalPages !== 0 ? (
				<Pagination
					totalPages={pagination.totalPages}
					currentPage={pagination.currentPage}
					clickPageNumber={clickPageNumber}
				/>
			) : null}
		</div>
	);
};
