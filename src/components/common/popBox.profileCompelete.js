import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar }) => {
	const { t } = useTranslation();

	return (
		<div className="Cancel active">
			<div class="icon icon-icon32px_Profile"></div>
			<div class="title">{t("lbl_UpdatedSuccessfully")}</div>
			<div class="txt-lightgray">
				{t("lbl_Awesome")}!
				<br />
				{t("lbl_GoDepositPage")}?
			</div>
			{btnBar}
		</div>
	);
};
