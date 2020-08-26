import React from "react";
import { number_format } from "../common/common";
import { useTranslation } from "react-i18next";

export default props => {
	const { t } = useTranslation();

	return (
		<div className="walletBalanceModule">
			<span className="icon icon-balance">
				{t("lbl_EligibleWithdrawalAmount")}
			</span>
			<span>
				{number_format(props.availableBalance, props._isConvert)}
			</span>
			<i
				className="icon icon-spinner11"
				onClick={props.refreshAvailableBalance}></i>
		</div>
	);
};
