import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
	api_payment_GetWithdrawalInfoHistory,
	api_payment_SetWithdrawalCancel
} from "../service/api/payment";
import { isConvert } from "../components/common/common";
import { userInfoContext, popBoxContext } from "../components/common/context";
import { TransactionHistory } from "../components/withdrawal/historyResult";
import { defPopBoxType } from "../components/common/popBox";
import { PageNumber } from "../components/common/pageNumber";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import moment from "moment";
import Filter from "../components/common/historyFilter";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<Content />
				</main>
			</Layout>
		</Wrapper>
	);
};

const initPagination = {
	totalPages: 0,
	currentPage: 1
};

const Content = () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [getHistory, setGetHistory] = useState(null);
	const [processing, setProcessing] = useState(false);
	const [filterData, setFilterData] = useState(null);
	const [pagination, setPagination] = useState(initPagination);
	const _isConvert = isConvert(userInfo.currencyId);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	});

	const GetWithdrawalInfoHistory = (transactionData, pageNumber) => {
		api_payment_GetWithdrawalInfoHistory({
			...transactionData,
			PageNumber: pageNumber
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setGetHistory(res.data.data);
					} else {
						alert(res.data.message);
					}
					setProcessing(false);
				}
			},
			err => {
				if (isMountedRef.current) {
					alert(t("msg_ApiServerError"));
					setProcessing(false);
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
			GetWithdrawalInfoHistory(transactionData, 1);
		}
	};

	const ClickCancel = transId => {
		const ClosePopBox = () => {
			setPopBox({ isOpen: false });
		};

		const ClickConfirm = () => {
			setPopBox({ isOpen: false });
			api_payment_SetWithdrawalCancel(transId).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setGetHistory(prev => {
								let newData = [...prev];
								let idx = newData.findIndex(
									x => x.transId === transId
								);
								newData[idx].status = 5;
								return newData;
							});
						} else {
							alert(res.data.message);
						}
					}
				},
				err => {
					if (isMountedRef.current) {
						alert(t("msg_ApiServerError"));
					}
				}
			);
		};

		setPopBox({
			isOpen: true,
			defPopBoxType: defPopBoxType.Cancel,
			btn: (
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

	const clickPageNumber = (i, e) => {
		e.preventDefault();
		let page = 1;

		if (!isNaN(i)) {
			page = i;
		} else if (i === "lastPage") {
			page =
				pagination.currentPage === 1 ? 1 : pagination.currentPage - 1;
		} else if (i === "nextPage") {
			page =
				pagination.currentPage === pagination.totalPages
					? pagination.totalPages
					: pagination.currentPage + 1;
		} else {
			page = pagination.currentPage;
		}

		if (!processing) {
			setProcessing(true);
			let transactionData = filterData;
			setPagination(prev => ({ ...prev, currentPage: page }));

			GetWithdrawalInfoHistory(transactionData, page);
		}
	};

	let arr = getHistory?.map((item, i) => {
		return (
			<TransactionHistory
				key={`withdrawaal-${item.transId}`}
				idx={i + 1}
				transId={item.transId}
				createTime={item.createTime}
				amount={item.amount}
				status={item.status}
				_isConvert={_isConvert}
				ClickCancel={ClickCancel}
			/>
		);
	});

	return (
		<section className="inside">
			<div id="leftMenu"></div>
			<div className="rightModule">
				<div className="infoModule">
					<div className="inside-title icon icon-icon32px_History">
						<span>{t("lbl_WithdrawalHistory")}</span>
					</div>
					<Filter submitHandler={clickDateSubmit} />
					{getHistory ? (
						getHistory.length > 0 ? (
							<div className="list history">
								<div className="listHeader">
									<div>{t("lbl_NO")}</div>
									<div>
										{t("lbl_Date")} {moment().format("Z")}
									</div>
									<div>{t("lbl_ID")}</div>
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
						<PageNumber
							totalPages={pagination.totalPages}
							currentPage={pagination.currentPage}
							clickPageNumber={clickPageNumber}
						/>
					) : null}
				</div>
			</div>
		</section>
	);
};
