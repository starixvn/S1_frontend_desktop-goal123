import React from "react";
import TandC from "../../service/t_and_c";

export default ({ langId, t }) => {
	return (
		<div>
			<span className="title">{t("lbl_OurPolicies")}</span>
			<div>
				<a
					href={TandC(langId).ResposibleGaming}
					target="_blank"
					rel="noreferrer">
					{t("lbl_ResposibleGaming")}
				</a>
				<a href={TandC(langId).terms} target="_blank" rel="noreferrer">
					{t("lbl_TermsConditions")}
				</a>
				<a
					href={TandC(langId).PrivacyPolicy}
					target="_blank"
					rel="noreferrer">
					{t("lbl_PrivacyPolicy")}
				</a>
				<a
					href={TandC(langId).CookiePolicy}
					target="_blank"
					rel="noreferrer">
					{t("lbl_CookiePolicy")}
				</a>
			</div>
		</div>
	);
};
