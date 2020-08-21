import React, { useEffect, useRef, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../common/context";
import { isConvert, number_format } from "../common/common";

export default props => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const toParentConfirm = () => {
		props.getChildConfirm(false);
	};

	const SubmitWitdhdraw = () => {
		props.submitWithdrawal(true);
	};

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
						<span>{props.accountNoValue.slice(0, 4)}</span>
						<span>{props.accountNoValue.slice(4, 8)}</span>
						<span>{props.accountNoValue.slice(8, 12)}</span>
						<span>{props.accountNoValue.slice(12, 16)}</span>
					</li>
				</ul>
				<ul>
					<li>{t("lbl_BankAccountName")}</li>
					<li>{userInfo.accountName}</li>
				</ul>
				<ul>
					<li>{t("lbl_WithdrawalAmount")}</li>
					<li>{number_format(props.amountValue, _isConvert)}</li>
				</ul>
			</div>
			<div className="btnGroup">
				<button className="btn-cancel" onClick={toParentConfirm}>
					{t("lbl_Cancel")}
				</button>
				<button className="btn-check" onClick={SubmitWitdhdraw}>
					{t("lbl_Submit")}
				</button>
			</div>
		</div>
	);
};
