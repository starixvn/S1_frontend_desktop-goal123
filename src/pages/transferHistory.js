import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { api_tp_GetTransferHistory } from "../service/api/tp";
import { isConvert } from "../components/common/common";
import { userInfoContext } from "../components/common/context";
import { TransactionHistory } from "../components/transferFunds/historyResult";
import { Pagination } from "../components/common/pagination";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import moment from "moment";
import Filter from "../components/common/historyFilter";
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

const transferDirection = (direction, displayMainWallet, displaySabaWallet) => {
	let startWallet = "";
	let endWallet = "";

	if (direction === 1) {
		startWallet = displayMainWallet;
		endWallet = displaySabaWallet;
	} else {
		startWallet = displaySabaWallet;
		endWallet = displayMainWallet;
	}
	return { startWallet, endWallet };
};

const initPagination = {
	totalPages: 0,
	currentPage: 1
};

const Content = () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const [getHistory, setGetHistory] = useState(null);
	const [filterData, setFilterData] = useState(null);
	const [processing, setProcessing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState(initPagination);
	const _isConvert = isConvert(userInfo.currencyId);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const GetTransferHistory = (transactionData, pageNumber) => {
		setLoading(true);

		api_tp_GetTransferHistory({
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
						alert(res.data.message);
					}
					setProcessing(false);
					setLoading(false);
				}
			},
			err => {
				if (isMountedRef.current) {
					alert(t("msg_ApiServerError"));
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
			GetTransferHistory(transactionData, 1);
		}
	};

	const clickPageNumber = page => {
		if (!processing) {
			setProcessing(true);
			let transactionData = filterData;
			setPagination(prev => ({ ...prev, currentPage: page }));
			GetTransferHistory(transactionData, page);
		}
	};

	let arr = getHistory?.map((item, i) => {
		const _transferDirection = transferDirection(
			item.direction,
			t("lbl_MainWallet"),
			t("lbl_Wallet_Saba")
		);
		const _status = item.status === 0 ? t("lbl_Success") : t("lbl_Fail");
		const _statusColor = item.status === 0 ? "approved" : "cancel";

		return (
			<TransactionHistory
				key={`transfer-${item.transId}`}
				idx={i + 1}
				_isConvert={_isConvert}
				createTime={item.createTime}
				transId={item.transId}
				amount={item.amount}
				startWallet={_transferDirection.startWallet}
				endWallet={_transferDirection.endWallet}
				status={_status}
				statusColor={_statusColor}
			/>
		);
	});

	return loading ? (
		<Loading />
	) : (
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_History">
				<span>{t("lbl_TransferHistory")}</span>
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
							<div>{t("lbl_Direction")}</div>
							<div>{t("lbl_Amount")}</div>
							<div>
								{t("lbl_Status")}
								<button
									className="icon icon-spinner11"
									onClick={clickDateSubmit.bind(
										this,
										filterData?.StartDate,
										filterData?.EndDate
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
