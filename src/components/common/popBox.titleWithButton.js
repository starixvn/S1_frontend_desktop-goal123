import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar, message }) => {
	const { t } = useTranslation();

	return (
		<div className="Success active">
			<div className="title">{message}</div>
			{/* <div className="txt-lightgray">{message}</div> */}
			{btnBar}
		</div>
	);
};
