import productList from "../../datas/productList";
import path from "../../path";

export const defSportsBetting = {
	soccer: {
		productInfo: productList.soccer,
		path: path.sports.root,
		displayKey: "lbl_SoccerBetting"
	},
	basketball: {
		productInfo: productList.basketball,
		path: path.sports.root,
		displayKey: "lbl_BasketballBetting"
	},
	badminton: {
		productInfo: productList.badminton,
		path: path.sports.root,
		displayKey: "lbl_badminton"
	},
	football: {
		productInfo: productList.football,
		path: path.sports.root,
		displayKey: "lbl_FootballBetting"
	},
	tennis: {
		productInfo: productList.tennis,
		path: path.sports.root,
		displayKey: "lbl_TennisBetting"
	},
	hockey: {
		productInfo: productList.hockey,
		path: path.sports.root,
		displayKey: "lbl_HockeyBetting"
	},
	eSport: {
		productInfo: productList.eSport,
		path: path.sports.root,
		displayKey: "lbl_eSportsBetting"
	}
};
