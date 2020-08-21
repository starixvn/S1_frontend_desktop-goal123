import React, { useContext } from "react";
import { userInfoContext } from "../common/context";
import { isConvert, number_format } from "../common/common";
import { useTranslation } from "react-i18next";

export default props => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const _isConvert = isConvert(userInfo.currencyId);

	return (
		<div className="calculation">
			<div>
				<div>{t("lbl_Balance")}</div>
				<div>{number_format(props.balance, _isConvert)}</div>
			</div>
			<div>-</div>
			<div>
				<div>{t("lbl_Deduction")}</div>
				<div>{number_format(props.deduction, _isConvert)}</div>
			</div>
			<div>=</div>
			<div>
				<div>{t("lbl_EligibleWithdrawalAmount")}</div>
				<div>{number_format(props.availableBalance, _isConvert)}</div>
			</div>
		</div>
	);
};
