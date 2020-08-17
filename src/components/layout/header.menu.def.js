import productList from "../../datas/productList";
import path from "../../path";

export const defMenuLinks = {
	sports: {
		productInfo: productList.sports,
		path: path.sports.root,
		displayKey: "lbl_Sports"
	},
	numberGame: {
		productInfo: productList.numberGame,
		path: path.sports.root,
		displayKey: "lbl_NumberGame"
	},
	virtualSport: {
		productInfo: productList.virtualSports,
		path: path.sports.root,
		displayKey: "lbl_VirtualSport"
	},
	casino: {
		path: path.casino.root,
		displayKey: "lbl_Casino",
		subMenu: [
			{
				className: "GPI",
				icon: "icon icon-GPI",
				displayText: "GPI"
			},
			{
				className: "YGG",
				icon: "icon icon-YGG",
				displayText: "YGG"
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
				displayText: "DG"
			},
			{
				className: "liveALL",
				icon: "icon icon-AB",
				displayText: "ALL"
			}
		]
	},
	lottery: {
		productInfo: productList.lottery,
		path: path.sports.root,
		displayKey: "lbl_KenoAndLottery"
	},
	fishing: {
		productInfo: productList.fishing,
		path: path.sports.root,
		displayKey: "lbl_Fishing"
	}
};

export const defSubListClassName = {
	casino: "casinoList",
	liveCasino: "livecasinoList"
};
