import React, { useEffect, useRef, useState, useContext } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../common/context";
import { api_payment_GetWithdrawalInfoRecent } from "../../service/api/payment";
import { TransactionHistory } from "./historyResult";
import { isConvert } from "../common/common";

export default props => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const [getHistory, setGetHistory] = useState(null);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		GetWithdrawalInfoRecent();
	}, []);

	const GetWithdrawalInfoRecent = () => {
		api_payment_GetWithdrawalInfoRecent().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setGetHistory(res.data.data);
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

	let arr = getHistory?.map((item, i) => {
		return (
			<TransactionHistory
				key={`withdrawal-recent-${item.transId}`}
				idx={i + 1}
				_isConvert={_isConvert}
				i18n={t}
				{...item}
			/>
		);
	});

	return (
		<div className="list">
			<div className="listHeader">
				<div>{t("NO")}</div>
				<div>
					{t("lbl_Date")} ({moment().format("Z")})
				</div>
				<div>{t("lbl_ID")}</div>
				<div>{t("lbl_Amount")}</div>
				<div>
					{t("lbl_Status")}
					<button
						className="icon icon-spinner11"
						onClick={GetWithdrawalInfoRecent}></button>
				</div>
			</div>
			<div className="listBody">{arr}</div>
		</div>
	);
};
