import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar, message, errorCode, icon = "icon-library" }) => {
	const { t } = useTranslation();

	return (
		<div className="Success active">
			<div className={`icon ${icon}`}></div>
			<div className="title">{t("lbl_Information")}</div>
			<div>
				<span>{message}</span>
			</div>
			{btnBar}
		</div>
	);
};
