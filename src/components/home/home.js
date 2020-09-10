import React, { useEffect, useRef, useContext } from "react";
import { userInfoContext, popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import { useTranslation } from "react-i18next";
import { setCookie, readCookie } from "../common/common";
import IndexBanner from "../../styles/img/indexBanner.jpg";
import { api_account_GetWalletInfo } from "../../service/api/account";

import edgeImg1 from "../../styles/img/EDGE1.jpg";
import edgeImg2 from "../../styles/img/EDGE2.jpg";
import edgeImg3 from "../../styles/img/EDGE3.jpg";

import specialImg1 from "../../styles/img/slots777.png";
import specialImg2 from "../../styles/img/service.png";
import specialImg3 from "../../styles/img/bank.png";
import specialImg4 from "../../styles/img/speed.png";
import Bong88 from "../../styles/img/bong88.png";

import Marquee from "./marquee";
import News from "./news";
import EventSwipper from "./eventSwipper";
import config from "../../config";
import GameQuickLinks from "./gameQuickLinks";
import SwipperBanner from "../common/swipperBanner";

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);

	const isMountedRef = useRef(null);
	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (userInfo.isLogin && userInfo.userName) {
			let cookieName = `balanceHint${userInfo.userName}`;
			let showDepositHint = false;
			if (readCookie(cookieName) !== "1") {
				setCookie(cookieName, "1", 1);
				showDepositHint = true;
			}

			if (showDepositHint) {
				api_account_GetWalletInfo().then(res => {
					if (res.data.errorCode === 0 && isMountedRef.current) {
						let tpWallets = res.data.data.tpWallets?.map(t => {
							return {
								tpId: t.tpId,
								balance: t.balance
							};
						});

						let hasBalance =
							res.data.data?.balance ||
							tpWallets?.filter(t => {
								return t.balance > 0;
							}).length >= 1;

						if (!hasBalance && showDepositHint) {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.DepositHint
							});
						}
					}
				});
			}
		}
	}, [userInfo.isLogin, userInfo.userName]);

	return (
		<main>
			<SwipperBanner ImgFolder="Promotion" filterHideInHome={true} />
			<Marquee />
			<GameQuickLinks t={t} />
			<section>
				<EventSwipper />
				<News />
				<div className="edge">
					<div>
						<div className="title">The Edge Of Goal123</div>
						<span></span>
					</div>
					<div className="articleModule">
						<div>
							<img src={edgeImg1} />
						</div>
						<div>
							<img src={edgeImg2} />
						</div>
						<div>
							<img src={edgeImg3} />
						</div>
					</div>
				</div>
				<div className="special">
					<div>
						<img src={specialImg1} />
						<ul>
							<li className="title">{t("lbl_ExtensiveGames")}</li>
							<li>{t("lbl_ExtensiveGamesDesc")}</li>
						</ul>
					</div>
					<div>
						<img src={specialImg2} />
						<ul>
							<li className="title">
								{t("lbl_ExcellentCustomerCare")}
							</li>
							<li>{t("lbl_ExcellentCustomerCareDesc")}</li>
						</ul>
					</div>
					<div>
						<img src={specialImg3} />
						<ul>
							<li className="title">{t("lbl_PaymentMethods")}</li>
							<li>{t("lbl_PaymentMethodsDesc")}</li>
						</ul>
					</div>
					<div>
						<img src={specialImg4} />
						<ul>
							<li className="title">
								{t("lbl_TransactionSpeed")}
							</li>
							<li>{t("lbl_TransactionSpeedDesc")}</li>
						</ul>
					</div>
				</div>
				<Platforms />
				<div className="powered">
					<div>{t("lbl_PoweredBy")}</div>
					<img src={Bong88} alt="Bong88" />
				</div>
			</section>
		</main>
	);
};

const defPlatform = [
	"saba",
	"ab",
	"yl",
	"ag",
	"gp",
	"dg",
	"sa",
	"yg",
	"pp",
	"sg",
	"pg"
];

const Platforms = () => {
	const platformRows = defPlatform.map(item => {
		return (
			<button key={`platform-${item}`}>
				<img src={`${config.imgUrl}/common/images/logo/${item}.png`} />
			</button>
		);
	});

	return <div className="platform">{platformRows}</div>;
};
