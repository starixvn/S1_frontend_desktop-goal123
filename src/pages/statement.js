import React, { useEffect, useState, useRef, useContext } from "react";
import { api_payment_GetStatement } from "../service/api/payment";
import { number_format, isConvert } from "../components/common/common";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../components/common/context";
import { PageNumber } from "../components/common/pageNumber";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import Filter from "../components/common/historyFilter";
import moment from "moment";

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
	const _isConvert = isConvert(userInfo.currencyId);
	const [getHistory, setGetHistory] = useState(null);
	const [processing, setProcessing] = useState(false);
	const [filterData, setFilterData] = useState(null);
	const [pagination, setPagination] = useState(initPagination);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const GetStatement = (transactionData, pageNumber) => {
		api_payment_GetStatement({
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
			GetStatement(transactionData, 1);
		}
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

			GetStatement(transactionData, page);
		}
	};

	let arr = getHistory?.map((item, i) => {
		return (
			<TansactionHistory
				key={`statement-${item.refTransId}`}
				idx={i + 1}
				createTime={item.createTime}
				refTransId={item.refTransId}
				typeName={item.typeName}
				changeAmount={item.changeAmount}
				beforeAmount={item.beforeAmount}
				afterAmount={item.afterAmount}
				_isConvert={_isConvert}
			/>
		);
	});

	return (
		<section className="inside">
			<div id="leftMenu"></div>
			<div className="rightModule">
				<div className="infoModule">
					<div className="inside-title icon icon-icon32px_History">
						<span>{t("lbl_Statement")}</span>
					</div>
					<Filter submitHandler={clickDateSubmit} />

					{getHistory ? (
						getHistory.length > 0 ? (
							<div className="list history">
								<div className="listHeader">
									<div>{t("lbl_NO")}.</div>
									<div>
										{t("lbl_Date")} {moment().format("Z")}
									</div>
									<div>{t("lbl_RefTransId")}</div>
									<div>{t("lbl_TypeName")}</div>
									<div>{t("lbl_ChangeAmount")}</div>
									<div>{t("lbl_BeforeAmount")}</div>
									<div>
										{t("lbl_AfterAmount")}
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

const TansactionHistory = props => {
	return (
		<div>
			<div>{props.idx}</div>
			<div>
				{moment(props.createTime).format("MM/DD/YYYY")}
				<span className="txt-blue2">
					{moment(props.createTime).format("hh:mm:ss A")}
				</span>
			</div>
			<div>{props.refTransId}</div>
			<div>{props.typeName}</div>
			<div>{number_format(props.changeAmount, props._isConvert)}</div>
			<div>{number_format(props.beforeAmount, props._isConvert)}</div>
			<div>{number_format(props.afterAmount, props._isConvert)}</div>
		</div>
	);
};
