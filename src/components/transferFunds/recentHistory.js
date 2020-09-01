import React, { useContext, useState, useEffect, useRef } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../common/context";
import { isConvert } from "../common/common";
import { TransactionHistory } from "./historyResult";
import { Link } from "@reach/router";
import path from "../../path";

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

export default props => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const _isConvert = isConvert(userInfo.currencyId);

	let arr = props.getHistory?.map((item, i) => {
		const _transferDirection = transferDirection(
			item.direction,
			t("lbl_MainWallet"),
			t("lbl_Wallet_Saba")
		);
		const _status = item.status === 0 ? t("lbl_Success") : t("lbl_Fail");
		const _statusColor = item.status === 0 ? "approved" : "cancel";
		return (
			<TransactionHistory
				key={`transfer-recent-${item.transId}`}
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

	return (
		<>
			<div className="list">
				<div className="listHeader">
					<div>{t("NO")}</div>
					<div>
						{t("lbl_Date")} ({moment().format("Z")})
					</div>
					<div>{t("lbl_ID")}</div>
					<div>{t("lbl_Direction")}</div>
					<div>{t("lbl_Amount")}</div>
					<div>
						{t("lbl_Status")}
						<button
							className="icon icon-spinner11"
							onClick={props.GetTransferRecent}></button>
					</div>
				</div>
				<div className="listBody">{arr}</div>
			</div>
			<Link
				to={`/${userInfo.langId}/${path.transferHistory.root}`}
				className="icon icon-books"></Link>
		</>
	);
};
