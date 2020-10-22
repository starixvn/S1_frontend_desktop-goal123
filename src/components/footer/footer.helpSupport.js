import React from "react";
import TandC from "../../service/t_and_c";

export default ({ langId, t }) => {
	return (
		<div>
			<span className="title">{t("lbl_HelpSupport")}</span>
			<div>
				<a
					href={TandC(langId).RuleRegulations}
					target="_blank"
					rel="noreferrer">
					{t("lbl_RuleRegulations")}
				</a>
				<a
					href={TandC(langId).AccountTerms}
					target="_blank"
					rel="noreferrer">
					{t("lbl_AccountTerms")}
				</a>
				<a href={TandC(langId).FAQ} target="_blank" rel="noreferrer">
					{t("lbl_FAQ")}
				</a>
				<a href={TandC(langId).Deposit} target="_blank">
					{t("lbl_Deposit")}
				</a>
				<a href={TandC(langId).Withdrawal} target="_blank">
					{t("lbl_Withdrawal")}
				</a>
			</div>
		</div>
	);
};
