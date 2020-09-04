import React, { useEffect, useRef, useState, useContext } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../common/context";
import {
	api_payment_GetWithdrawalInfoRecent,
	api_payment_SetWithdrawalCancel
} from "../../service/api/payment";
import { TransactionHistory } from "./historyResult";
import { isConvert } from "../common/common";
import { defPopBoxType } from "../common/popBox";
import path from "../../path";
import { Link } from "@reach/router";
import Loading from "../common/loading";

export default props => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const [getHistory, setGetHistory] = useState(null);
	const [loading, setLoading] = useState(true);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		GetWithdrawalInfoRecent();
	}, []);

	useEffect(() => {
		if (props.shouldRefresh === true) {
			GetWithdrawalInfoRecent();
		}
	}, [props.shouldRefresh]);

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const GetWithdrawalInfoRecent = () => {
		setLoading(true);

		api_payment_GetWithdrawalInfoRecent().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setGetHistory(res.data.data);
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
							setGetHistory(prev => {
								let newData = [...prev];
								let idx = newData.findIndex(
									x => x.transId === transId
								);
								newData[idx].status = 5;
								return newData;
							});
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

	let arr = getHistory?.map((item, i) => {
		return (
			<TransactionHistory
				key={`withdrawal-recent-${item.transId}`}
				idx={i + 1}
				_isConvert={_isConvert}
				i18n={t}
				{...item}
				ClickCancel={ClickCancel.bind(this, item.transId)}
			/>
		);
	});

	return loading ? (
		<Loading />
	) : getHistory ? (
		<>
			<div className="list">
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
						<button
							className="icon icon-spinner11"
							onClick={GetWithdrawalInfoRecent}></button>
					</div>
				</div>
				<div className="listBody">{arr}</div>
			</div>
			<Link
				to={`/${userInfo.langId}/${path.withdrawalHistory.root}`}
				className="icon icon-books"></Link>
		</>
	) : (
		<div className="nodata">{t("msg_NoData")}</div>
	);
};
