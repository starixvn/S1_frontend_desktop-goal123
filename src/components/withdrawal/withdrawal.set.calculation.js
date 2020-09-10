import React from "react";
import {  number_format } from "../common/common";
import { useTranslation } from "react-i18next";

export default props => {
	const { t } = useTranslation();
	return (
		<div className="calculation">
			<div>
				<div>{t("lbl_Balance")}</div>
				<div>{number_format(props.balance, props._isConvert)}</div>
			</div>
			<div>-</div>
			<div>
				<div>{t("lbl_Deduction")}</div>
				<div>{number_format(props.deduction, props._isConvert)}</div>
			</div>
			<div>=</div>
			<div>
				<div>{t("lbl_EligibleWithdrawalAmount")}</div>
				<div>{number_format(props.availableBalance, props._isConvert)}</div>
			</div>
		</div>
	);
};
