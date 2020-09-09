import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../common/context";
import { number_format } from "../common/common";

export default props => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);

	return (
		<div className="subModuleBody column align-items-center">
			<span className="title">{t("lbl_ImportantNote")}</span>
			<div className="txt-lightgray">{t("lbl_ConfirmWithdrawal")}</div>
			<div className="smallList">
				<ul>
					<li>{t("lbl_WithdrawalTo")}</li>
					<li>{props.bankNameValue}</li>
				</ul>
				<ul>
					<li>{t("lbl_AccountNumber")}</li>
					<li className="accountNumber">
						{props.accountNoValue?.slice(0, 4) + " "}
						{props.accountNoValue?.slice(4, 8) + " "}
						{props.accountNoValue?.slice(8, 12) + " "}
						{props.accountNoValue?.slice(12, 16)}
					</li>
				</ul>
				<ul>
					<li>{t("lbl_BankAccountName")}</li>
					<li>{userInfo.accountName}</li>
				</ul>
				<ul>
					<li>{t("lbl_WithdrawalAmount")}</li>
					<li>
						{number_format(props.amountValue, props._isConvert)}
					</li>
				</ul>
			</div>
			<div className="btnGroup">
				<button className="btn-cancel" onClick={props.cancelSubmit}>
					{t("lbl_Cancel")}
				</button>
				<button className="btn-check" onClick={props.confirmSubmit}>
					{t("lbl_Confirm")}
				</button>
			</div>
		</div>
	);
};
