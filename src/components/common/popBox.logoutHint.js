import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar }) => {
	const { t } = useTranslation();

	return (
		<div className="Success active">
			<div className="icon icon-exit"></div>
			<div className="title">{t("lbl_Logout")}</div>
			<div className="txt-lightgray">{t("msg_ForceLogedout")}</div>
			{btnBar}
		</div>
	);
};
