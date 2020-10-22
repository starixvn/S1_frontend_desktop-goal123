import React from "react";
import { Link } from "gatsby";
import path from "../../path";
import TandC from "../../service/t_and_c";
import { siteInfo } from "../../config";

export default ({ langId, t, hideSiteMap = false }) => (
	<div>
		<span className="title">{t("lbl_AboutGoal123")}</span>
		<div>
			<a
				style={{ fontWeight: "bold" }}
				href={siteInfo({ langId: langId }).affiliateLink}
				target="_blank"
				rel="noreferrer">
				{t("lbl_Affiliates")?.toUpperCase()}
			</a>
			<a href={TandC(langId).AboutUs} target="_blank" rel="noreferrer">
				{t("lbl_AboutUs")}
			</a>
			<a href={TandC(langId).Terms} target="_blank" rel="noreferrer">
				{t("lbl_Terms")}
			</a>
			<a href={TandC(langId).ContactUs} target="_blank" rel="noreferrer">
				{t("lbl_ContactUs")}
			</a>
			{hideSiteMap ? null : (
				<Link to={`/${langId}/${path.siteMap.root}`}>
					{t("lbl_SiteMap")}
				</Link>
			)}
		</div>
	</div>
);
