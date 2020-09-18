import React, { useContext } from "react";
import { SET_ENTER_PAGE, SET_CASINO_ENTER_PAGE } from "../../service/enterPage";
import { defPopBoxType } from "../common/popBox";
import { popBoxContext } from "../common/context";
import Saba1Club1 from "../../styles/img/Saba1Club1.png";
import Saba1Club2 from "../../styles/img/Saba1Club2.png";
import Saba1Club3 from "../../styles/img/Saba1Club3.png";
import Saba1Club4 from "../../styles/img/Saba1Club4.png";
import Saba1Club5 from "../../styles/img/Saba1Club5.png";
import SexyGaming from "../../styles/img/SexyGaming.png";
import DG from "../../styles/img/DG.png";
import PP1 from "../../styles/img/PP1.jpg";
import PP2 from "../../styles/img/PP2.jpg";
import PP3 from "../../styles/img/PP3.jpg";
import PP4 from "../../styles/img/PP4.jpg";
import VirtualGames from "../../styles/img/VirtualGames.jpg";
import Keno from "../../styles/img/Keno.jpg";
import Lottery from "../../styles/img/Lottery.jpg";

const defLinkType = {
	default: "default",
	casino: "casino"
};

const defGameList = [
	{
		img: Saba1Club1,
		displayKey: "lbl_Saba1Club1",
		tpId: 1,
		gmaeId: 200,
		betType: 1613
	},
	{
		img: Saba1Club2,
		displayKey: "lbl_Saba1Club2",
		tpId: 1,
		gmaeId: 200,
		betType: 1620
	},
	{
		img: Saba1Club3,
		displayKey: "lbl_Saba1Club3",
		tpId: 1,
		gmaeId: 200,
		betType: 1612
	},
	{
		img: Saba1Club4,
		displayKey: "lbl_Saba1Club4",
		tpId: 1,
		gmaeId: 200,
		betType: 1615
	},
	{
		img: Saba1Club5,
		displayKey: "lbl_Saba1Club5",
		tpId: 1,
		gmaeId: 200,
		betType: 1614
	},
	{
		img: SexyGaming,
		displayKey: "Baccarat",
		tpId: 15
	},
	{
		img: DG,
		displayKey: "Sedie",
		tpId: 4,
		gameId: 71401
	},
	{
		img: PP1,
		displayKey: "lbl_Casino_PP_FireStrike",
		tpId: 5,
		gameId: "vs10firestrike",
		linkType: defLinkType.casino
	},
	{
		img: PP2,
		displayKey: "lbl_Casino_PP_888Dragons",
		tpId: 5,
		gameId: "vs1dragon8",
		linkType: defLinkType.casino
	},
	{
		img: PP3,
		displayKey: "lbl_Casino_PP_AztecGems",
		tpId: 5,
		gameId: "vs5aztecgems",
		linkType: defLinkType.casino
	},
	{
		img: PP4,
		displayKey: "lbl_Casino_PP_SweetBonanza",
		tpId: 5,
		gameId: "vs20fruitsw",
		linkType: defLinkType.casino
	},
	{
		img: VirtualGames,
		displayKey: "lbl_VirtualGames",
		tpId: 1,
		gameId: 245
	},
	{
		img: Keno,
		displayKey: "lbl_Keno",
		tpId: 1,
		gameId: 202
	},
	{
		img: Lottery,
		displayKey: "lbl_Lottery",
		tpId: 1,
		gameId: 220
	}
];

export default ({ t, userInfo }) => {
	const { setPopBox } = useContext(popBoxContext);

	const ClickGame = (tpId, gameId, betType, linkType) => {
		const LoginPopBox = () => {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.Login
			});
		};

		if (linkType === defLinkType.casino) {
			if (userInfo.isLogin !== true) {
				LoginPopBox();
			} else {
				SET_CASINO_ENTER_PAGE(tpId, gameId, false, userInfo.langId);
			}
		} else {
			SET_ENTER_PAGE({
				langId: userInfo.langId,
				tpId: tpId,
				gameId: gameId,
				isLogin: userInfo.isLogin,
				betType: betType,
				loginCallback: LoginPopBox
			});
		}
	};

	let rows = defGameList.map(g => {
		let displayText = t(g.displayKey) ?? g.displayKey;
		return (
			<button
				key={`promoGameList-${g.displayKey}`}
				onClick={ClickGame.bind(
					this,
					g.tpId,
					g.gameId,
					g.betType,
					g.linkType
				)}>
				<img src={g.img} alt={displayText} />
				<div>{displayText}</div>
			</button>
		);
	});

	return <div className="indexGameList">{rows}</div>;
};
