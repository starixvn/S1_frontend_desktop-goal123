import productList from "../../datas/productList";
import path from "../../path";

export const defMenuType = {
	entPage: "entPage",
	Link: "Link"
};

export const defMenuLinks = {
	sports: {
		productInfo: productList.sports,
		path: path.sports.root,
		displayKey: "lbl_Sports"
	},
	cockFighting: {
		productInfo: productList.cockFighting,
		displayKey: "lbl_CockFighting"
	},
	sabaClub: {
		productInfo: productList.sabaClub,
		displayKey: "lbl_SabaClub"
	},
	eSport: {
		productInfo: productList.eSport,
		displayKey: "lbl_eSports"
	},
	// numberGame: {
	// 	productInfo: productList.numberGame,
	// 	path: path.sports.root,
	// 	displayKey: "lbl_NumberGame"
	// },
	// virtualSport: {
	// 	productInfo: productList.virtualSports,
	// 	path: path.sports.root,
	// 	displayKey: "lbl_VirtualSport"
	// },
	casino: {
		path: path.casino.root,
		displayKey: "lbl_Slots",
		subMenu: [
			{
				className: "GPI",
				icon: "icon icon-GPI",
				displayText: "GPI",
				menuType: defMenuType.Link,
				tpId: 6,
				parameter: { tpId: 6 }
			},
			{
				className: "YGG",
				icon: "icon icon-YGG",
				displayText: "YGG",
				menuType: defMenuType.Link,
				tpId: 8,
				parameter: { tpId: 8 }
			},
			{
				className: "JOKER",
				icon: "icon icon-JOKER",
				displayText: "JOKER",
				menuType: defMenuType.Link,
				tpId: 9,
				parameter: { tpId: 9 }
			},
			{
				className: "SG",
				icon: "icon icon-SG",
				displayText: "SG",
				menuType: defMenuType.Link,
				tpId: 10,
				parameter: { tpId: 10 }
			},
			{
				className: "PP",
				icon: "icon icon-PP",
				displayText: "PP",
				menuType: defMenuType.Link,
				tpId: 5,
				parameter: { tpId: 5 }
			},
			{
				className: "PG",
				icon: "icon icon-PG",
				displayText: "PG",
				menuType: defMenuType.Link,
				tpId: 14,
				parameter: { tpId: 14 }
			},
			{
				className: "OW",
				icon: "icon icon-OW",
				displayText: "OW",
				menuType: defMenuType.entPage,
				tpId: 1,
				gameId: 208
			}
		]
	},
	liveCasino: {
		path: path.liveCasino.root,
		displayKey: "lbl_LiveCasino",
		subMenu: [
			{
				className: "liveDG",
				icon: "icon icon-DG",
				displayText: "DG",
				menuType: defMenuType.entPage
			},
			{
				className: "liveALL",
				icon: "icon icon-AB",
				displayText: "ALL",
				menuType: defMenuType.entPage
			},
			{
				className: "liveAG",
				icon: "icon icon-AG",
				displayText: "AG",
				menuType: defMenuType.entPage
			},
			{
				className: "livePP",
				icon: "icon icon-PP",
				displayText: "PP",
				menuType: defMenuType.entPage
			},
			{
				className: "liveSA",
				icon: "icon icon-SA",
				displayText: "SA",
				menuType: defMenuType.entPage
			}
		]
	},
	promotion: {
		path: path.promotion.root,
		displayKey: "lbl_Promotion"
	}
	// lottery: {
	// 	productInfo: productList.lottery,
	// 	path: path.sports.root,
	// 	displayKey: "lbl_KenoAndLottery"
	// }
	// fishing: {
	// 	productInfo: productList.fishing,
	// 	path: path.sports.root,
	// 	displayKey: "lbl_Fishing"
	// }
};

export const defSubListClassName = {
	casino: "casinoList",
	liveCasino: "livecasinoList"
};
