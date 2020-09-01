import React, { useContext } from "react";
import { userInfoContext } from "../common/context";
import LinkItems from "../common/linkItems";

import productList from "../../datas/productList";
import path from "../../path";

export const defSportsQuickLinks = {
	soccer: {
		productInfo: productList.soccer,
		className: "icon icon-soccer",
		path: path.sports.root,
		displayKey: "lbl_SoccerBetting"
	},
	basketball: {
		productInfo: productList.basketball,
		path: path.sports.root,
		className: "icon icon-basketball",
		displayKey: "lbl_BasketballBetting"
	},
	badminton: {
		productInfo: productList.badminton,
		path: path.sports.root,
		className: "icon icon-badminton",
		displayKey: "lbl_badminton"
	},
	tennis: {
		productInfo: productList.tennis,
		path: path.sports.root,
		className: "icon icon-tennis",
		displayKey: "lbl_TennisBetting"
	},
	eSport: {
		productInfo: productList.eSport,
		path: path.sports.root,
		className: "icon icon-esport",
		displayKey: "lbl_eSportsBetting"
	}
};

export default ({ t }) => {
	const { userInfo } = useContext(userInfoContext);

	return (
		<div className="gameMenu">
			<div>
				<LinkItems
					defMenuLinks={defSportsQuickLinks}
					t={t}
					langId={userInfo.langId}
					isLogin={userInfo.isLogin}
					checkMatchPage={false}
				/>
			</div>
		</div>
	);
};
