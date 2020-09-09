import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar, message, ClickClose }) => {
	const { t } = useTranslation();

	return (
		<div className="Success active">
			<button className="icon icon-cross" onClick={ClickClose}>
				X
			</button>
			<div className="icon icon-icon32px_password"></div>
			<div className="title">{t("lbl_ChangePassword")}</div>
			<div className="txt-lightgray">{message}</div>
			{btnBar}
		</div>
	);
};
