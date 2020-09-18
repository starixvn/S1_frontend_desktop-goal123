import React, { useContext, useRef } from "react";
import Swiper from "react-id-swiper";
import { userInfoContext } from "../common/context";
import LinkItems from "../common/linkItems";

import productList from "../../datas/productList";
import path from "../../path";

export const defSportsQuickLinks = {
	soccer: {
		productInfo: productList.soccer,
		className: "icon icon-soccer",
		path: path.sports.root,
		displayKey: "lbl_Soccer"
	},
	sabaClub: {
		productInfo: productList.sabaClub,
		className: "icon icon-saba",
		displayKey: "lbl_SabaClub",
		isHot: true
	},
	cockFighting: {
		productInfo: productList.cockFighting,
		className: "icon icon-cock",
		displayKey: "lbl_CockFighting",
		isHot: true
	},
	eSport: {
		productInfo: productList.eSport,
		className: "icon icon-esport",
		displayKey: "lbl_eSports"
	},
	lottery: {
		productInfo: productList.lottery,
		className: "icon icon-lottery",
		displayKey: "lbl_Lottery"
	},
	slots: {
		path: path.casino.root,
		className: "icon icon-icon_777",
		displayKey: "lbl_Slots"
	},
	keno: {
		productInfo: productList.keno,
		className: "icon icon-keno",
		displayKey: "lbl_Keno"
	},
	numberGame: {
		productInfo: productList.numberGame,
		className: "icon icon-icon32px_keno-14",
		displayKey: "lbl_NumberGame"
	},
	virtualSports: {
		productInfo: productList.virtualSports,
		className: "icon icon-virtual-sports",
		displayKey: "lbl_VirtualSports"
	},
	fishing: {
		productInfo: productList.fishing,
		className: "icon icon-game",
		displayKey: "lbl_Fishing"
	}
};

export default ({ t }) => {
	const { userInfo } = useContext(userInfoContext);

	return (
		<div class="gameMenu">
			<div>
				<LinkItems
					defMenuLinks={defSportsQuickLinks}
					t={t}
					langId={userInfo.langId}
					isLogin={userInfo.isLogin}
				/>
			</div>
		</div>
	);
};
