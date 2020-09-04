import React, { useState } from "react";
import { number_format } from "../common/common";
import { useTranslation } from "react-i18next";

export default props => {
	const { t } = useTranslation();

	const [showRealNameHint, setShowRealNameHint] = useState(false);
	const onHandleRealNameHint = () => {
		setShowRealNameHint(prevS => !prevS);
	};

	return (
		<>
			{props.accountName ? (
				<div className="walletBalanceModule">
					<span className="icon icon-balance">
						{props.accountName}
					</span>
					<i
						className="icon icon-error"
						onClick={onHandleRealNameHint}></i>
					<div className={`tip${showRealNameHint ? " active" : ""}`}>
						{t("lbl_BankAccountName")}
					</div>
				</div>
			) : null}
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
		</>
	);
};
