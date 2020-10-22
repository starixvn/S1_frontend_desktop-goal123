import React, { useContext } from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../components/common/context";
import Bettings from "../components/footer/footer.bettings";
import OurPolicies from "../components/footer/footer.ourPolicies";
import HelpSupport from "../components/footer/footer.helpSupport";
import About from "../components/footer/footer.about";
import Promotions from "../components/footer/footer.promotions";
import { defLeftMenu } from "../components/common/leftMenu.def";
import { Link } from "@reach/router";

export default () => {
	return (
		<Wrapper>
			<Layout>
				<main>
					<section className="inside">
						<Content />
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};

const Menus = ({ langId, t }) => {
	let rows = Object.keys(defLeftMenu).map(k => {
		let mainMenuInfo = defLeftMenu[k];
		let subMenus = Object.keys(mainMenuInfo?.subMenu)?.map(sk => {
			let subMenuInfo = mainMenuInfo?.subMenu[sk];
			return (
				<Link
					key={`sitemap-menu-${k}-${sk}`}
					to={`/${langId}/${subMenuInfo.path}`}>
					{t(subMenuInfo.displayKey)}
				</Link>
			);
		});
		return (
			<div key={`sitemap-menu-${k}`}>
				<span className="title">{t(mainMenuInfo.displayKey)}</span>
				<div>{subMenus}</div>
			</div>
		);
	});

	return rows;
};

const Content = () => {
	const { userInfo } = useContext(userInfoContext);
	const { t } = useTranslation();

	return (
		<div className="rightModule">
			<div className="infoModule">
				<div className="inside-title icon icon-map2">
					<span>{t("lbl_SiteMap")}</span>
				</div>
				<div className="Sitemap">
					<Bettings
						t={t}
						langId={userInfo.langId}
						isLogin={userInfo.isLogin}
					/>
					<OurPolicies langId={userInfo.langId} t={t} />
					<HelpSupport langId={userInfo.langId} t={t} />

					<About langId={userInfo.langId} t={t} hideSiteMap={true} />
					<Menus langId={userInfo.langId} t={t} />
					<Promotions langId={userInfo.langId} t={t} />
				</div>
			</div>
		</div>
	);
};
