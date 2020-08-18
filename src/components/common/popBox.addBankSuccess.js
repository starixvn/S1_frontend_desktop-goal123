import React from "react";

import { useTranslation } from "react-i18next";

export default ({ btnBar }) => {
	const { t } = useTranslation();

	return (
		<div className="updateSuccess active">
			<div className="icon icon-library"></div>
			<div className="title">Add Bank Account</div>
			<div className="txt-lightgray">Update Successful.</div>
			{btnBar}
		</div>
	);
};
