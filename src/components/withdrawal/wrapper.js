import React from "react";
import { useTranslation } from "react-i18next";

export default ({ children }) => {
	const { t } = useTranslation();
	return <div className="infoModule">{children}</div>;
};
