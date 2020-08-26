import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar, message }) => {
	const { t } = useTranslation();

	return (
		<div className="Success active">
			<div className="icon icon-icon32px_password"></div>
			<div className="title">{t("lbl_ChangePassword")}</div>
			<div className="txt-lightgray">{message}</div>
			{btnBar}
		</div>
	);
};
