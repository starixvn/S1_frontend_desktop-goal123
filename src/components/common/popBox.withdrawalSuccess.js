import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar }) => {
	const { t } = useTranslation();

	return (
		<div className="Cancel active">
			<div className="icon icon-icon32px_Withdraw"></div>
			<div className="txt-lightgray">{t("lbl_WithdrawalSuccess")}</div>
			{btnBar}
		</div>
	);
};
