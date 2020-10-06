import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../common/context";
import { defSportsBetting } from "./footer.def";
import LinkItems from "../common/linkItems";
import { Link } from "gatsby";
import path from "../../path";
// import SocialMedia1 from "../../styles/img/te.png";
// import SocialMedia2 from "../../styles/img/tw.png";
// import SocialMedia3 from "../../styles/img/fb.png";
// import SocialMedia4 from "../../styles/img/yb.png";
// import SocialMedia5 from "../../styles/img/ig.png";
import TandC from "../../service/t_and_c";
import { siteInfo } from "../../config";

const Bettings = ({ t, langId, isLogin }) => {
	return (
		<div>
			<span className="title">{t("lbl_SportsBetting")}</span>
			<div>
				<LinkItems
					defMenuLinks={defSportsBetting}
					t={t}
					langId={langId}
					isLogin={isLogin}
					checkMatchPage={false}
				/>
			</div>
		</div>
	);
};

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);

	return (
		<footer>
			<div className="webmap">
				<Bettings
					t={t}
					langId={userInfo.langId}
					isLogin={userInfo.isLogin}
				/>
				<div>
					<span className="title">{t("lbl_OurPolicies")}</span>
					<div>
						<a
							href={TandC(userInfo.langId).ResposibleGaming}
							target="_blank"
							rel="noreferrer">
							{t("lbl_ResposibleGaming")}
						</a>
						<a
							href={TandC(userInfo.langId).terms}
							target="_blank"
							rel="noreferrer">
							{t("lbl_TermsConditions")}
						</a>
						<a
							href={TandC(userInfo.langId).PrivacyPolicy}
							target="_blank"
							rel="noreferrer">
							{t("lbl_PrivacyPolicy")}
						</a>
						<a
							href={TandC(userInfo.langId).CookiePolicy}
							target="_blank"
							rel="noreferrer">
							{t("lbl_CookiePolicy")}
						</a>
					</div>
				</div>
				<div>
					<span className="title">{t("lbl_HelpSupport")}</span>
					<div>
						<a
							href={TandC(userInfo.langId).RuleRegulations}
							target="_blank"
							rel="noreferrer">
							{t("lbl_RuleRegulations")}
						</a>
						<a
							href={TandC(userInfo.langId).AccountTerms}
							target="_blank"
							rel="noreferrer">
							{t("lbl_AccountTerms")}
						</a>
						<a
							href={TandC(userInfo.langId).FAQ}
							target="_blank"
							rel="noreferrer">
							{t("lbl_FAQ")}
						</a>
						<a
							href={TandC(userInfo.langId).Deposit}
							target="_blank">
							{t("lbl_Deposit")}
						</a>
						<a
							href={TandC(userInfo.langId).Withdrawal}
							target="_blank">
							{t("lbl_Withdrawal")}
						</a>
					</div>
				</div>
				<div>
					<span className="title">{t("lbl_Promotions")}</span>
					<div>
						<Link to={path.promotion.root}>
							{t("lbl_Promotions")}
						</Link>
					</div>
				</div>
				<div>
					<span className="title">{t("lbl_AboutGoal123")}</span>
					<div>
						<a
							style={{ fontWeight: "bold" }}
							href={siteInfo.affiliateLink}
							target="_blank"
							rel="noreferrer">
							{t("lbl_Affiliates")?.toUpperCase()}
						</a>
						<a
							href={TandC(userInfo.langId).AboutUs}
							target="_blank"
							rel="noreferrer">
							{t("lbl_AboutUs")}
						</a>
						<a
							href={TandC(userInfo.langId).Terms}
							target="_blank"
							rel="noreferrer">
							{t("lbl_Terms")}
						</a>
						<a
							href={TandC(userInfo.langId).ContactUs}
							target="_blank"
							rel="noreferrer">
							{t("lbl_ContactUs")}
						</a>
					</div>
				</div>

				<div>
					<span className="title">{t("lbl_ContactUs")}</span>
					<div>{t("lbl_ConatctUsHint")}</div>
					{/* <div>
					<span className="title">Social Media</span>
					<div>
						<a href="">
							<img src={SocialMedia1} />
						</a>
						<a href="">
							<img src={SocialMedia2} />
						</a>
						<a href="">
							<img src={SocialMedia3} />
						</a>
					</div>
					<div>
						<a href="">
							<img src={SocialMedia4} />
						</a>
						<a href="">
							<img src={SocialMedia5} />
						</a>
					</div>
				</div> */}
				</div>
			</div>
			<div className="copyright">
				© Copyright 2020. Goal123. All Rights Reserved.
			</div>
		</footer>
	);
};
