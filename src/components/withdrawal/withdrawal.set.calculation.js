import React from "react";
import { number_format } from "../common/common";
import { useTranslation } from "react-i18next";

export default ({ balanceData, _isConvert }) => {
	const { t } = useTranslation();
	const { balance, deduction, availableBalance } = balanceData;

	return (
		<div className="calculation">
			<div>
				<div>{t("lbl_Balance")}</div>
				<div>{number_format(balance, _isConvert)}</div>
			</div>
			<div>-</div>
			<div>
				<div>{t("lbl_Deduction")}</div>
				<div>{number_format(deduction, _isConvert)}</div>
			</div>
			<div>=</div>
			<div>
				<div>{t("lbl_EligibleWithdrawalAmount")}</div>
				<div>{number_format(availableBalance, _isConvert)}</div>
			</div>
		</div>
	);
};
