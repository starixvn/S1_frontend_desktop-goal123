import React, { useContext } from "react";
import { userInfoContext } from "../common/context";
import { isConvert,number_format } from "../common/common";
import { useTranslation } from "react-i18next";

export default props => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const _isConvert = isConvert(userInfo.currencyId);

	const toParentRefresh = () => {
		props.refreshAvailable(true)
	}

	return (
		<div className="walletBalanceModule">
			<span className="icon icon-balance">
				{t("lbl_EligibleWithdrawalAmount")}
			</span>
			<span>{number_format(props.availableBalance, _isConvert)}</span>
			<i className="icon icon-spinner11"
				onClick={toParentRefresh}
			></i>
		</div>
	);
};
