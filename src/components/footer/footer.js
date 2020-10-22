import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../common/context";
// import SocialMedia1 from "../../styles/img/te.png";
// import SocialMedia2 from "../../styles/img/tw.png";
// import SocialMedia3 from "../../styles/img/fb.png";
// import SocialMedia4 from "../../styles/img/yb.png";
// import SocialMedia5 from "../../styles/img/ig.png";
import Bettings from "./footer.bettings";
import OurPolicies from "./footer.ourPolicies";
import HelpSupport from "./footer.helpSupport";
import Promotions from "./footer.promotions";
import About from "./footer.about";

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
				<OurPolicies langId={userInfo.langId} t={t} />
				<HelpSupport langId={userInfo.langId} t={t} />
				<Promotions langId={userInfo.langId} t={t} />
				<About langId={userInfo.langId} t={t} />

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
