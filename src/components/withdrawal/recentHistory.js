import React, { useEffect, useRef, useState, useContext } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../common/context";
import { api_payment_SetWithdrawalCancel } from "../../service/api/payment";
import { TransactionHistory } from "./historyResult";
import { defPopBoxType } from "../common/popBox";
import path from "../../path";
import { Link } from "@reach/router";
import Loading from "../common/loading";
import ReloadSpin from "../common/reloadSpin";

export default ({
	recentData,
	setRecentData,
	getKycStatus,
	getWithdrawalInfoRecent,
	getWithdrawalAvailableBalance
}) => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [loading, setLoading] = useState(false);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const ClickCancel = transId => {
		const ClosePopBox = () => {
			setPopBox({ isOpen: false });
		};

		const ClickConfirm = () => {
			setLoading(true);

			setPopBox({ isOpen: false });
			api_payment_SetWithdrawalCancel(transId).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setRecentData(prev => {
								let newData = [...prev];
								let idx = newData.findIndex(
									x => x.transId === transId
								);
								newData[idx].status = 5;
								return newData;
							});

							getWithdrawalAvailableBalance();
							getKycStatus();
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

		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Cancel,
			btnBar: (
				<div className="btnGroup">
					<button className="btn-cancel" onClick={ClickConfirm}>
						{t("lbl_Yes")}
					</button>
					<button className="btn-check" onClick={ClosePopBox}>
						{t("lbl_No")}
					</button>
				</div>
			)
		});
	};

	let arr = recentData?.map((item, i) => {
		return (
			<TransactionHistory
				key={`withdrawal-recent-${item.transId}`}
				idx={i + 1}
				i18n={t}
				{...item}
				ClickCancel={ClickCancel.bind(this, item.transId)}
			/>
		);
	});

	if (loading) return <Loading />;

	if (recentData.length === 0) return null;

	return (
		<>
			<div className="list">
				<div className="tip active">{t("msg_AmountFormatTip")}</div>
				<div className="listHeader">
					<div>{t("lbl_NO")}</div>
					<div>
						{t("lbl_Date")} ({moment().format("Z")})
					</div>
					<div>{t("lbl_ID")}</div>
					<div>{t("lbl_Amount")}</div>
					<div>{t("lbl_Status")}</div>
					<div>
						{t("lbl_Action")}
						<ReloadSpin func={getWithdrawalInfoRecent} />
					</div>
				</div>
				{recentData?.length > 0 ? (
					<div className="listBody">{arr}</div>
				) : (
					<div className="nodata">{t("msg_NoData")}</div>
				)}
			</div>
			<Link
				to={`/${userInfo.langId}/${path.withdrawalHistory.root}`}
				className="icon icon-books"></Link>
		</>
	);
};
