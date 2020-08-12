import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar, message }) => {
	const { t } = useTranslation();

	return (
		<div className="Success active">
			<div className="icon icon-library"></div>
			<div className="title">{t("lbl_Information")}</div>
			<div className="txt-lightgray">{message}</div>
			{btnBar}
		</div>
	);
};
