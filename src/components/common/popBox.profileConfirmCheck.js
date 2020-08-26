import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar, accountName }) => {
	const { t } = useTranslation();

	return (
		<div className="Cancel active">
			<div class="icon icon-icon32px_notification"></div>
			<div class="title">{accountName}</div>
			<div class="txt-lightgray">
				{t("lbl_EnsureTransactionsCorrect")}
				<br />
				{t("lbl_BankAccountNameHint")}
			</div>
			{btnBar}
		</div>
	);
};
