import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@reach/router";
import { userInfoContext } from "../common/context";
import { defMenuLinks } from "./header.menu.def";
import LinkItems, { getCurrentPage } from "../common/linkItems";
import { siteInfo } from "../../config";

export default ({ showSubMenu }) => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	let currentPage = getCurrentPage();

	return (
		<>
			<Link
				to={`/${userInfo.langId}`}
				className={
					currentPage === `/${userInfo.langId}` ? "active" : ""
				}>
				<i className="icon icon-home"></i>
			</Link>
			<LinkItems
				defMenuLinks={defMenuLinks}
				t={t}
				showSubMenu={showSubMenu}
				langId={userInfo.langId}
				isLogin={userInfo.isLogin}
				checkMatchPage={true}
				toUpperCase={true}
			/>
			<a
				href={siteInfo({ langId: userInfo.langId }).affiliateLink}
				target="_blank">
				{t("lbl_Affiliates")?.toUpperCase()}
			</a>
		</>
	);
};
