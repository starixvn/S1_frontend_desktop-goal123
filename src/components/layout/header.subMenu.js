import React, { useState, useEffect } from "react";

export default props => {
	const [casinoActive, setCasinoActive] = useState(false);
	const [liveCasinoActive, setLiveCasinoActive] = useState(false);

	// if (props.subMenuKey === "lbl_Casino") {
	// 	setCasinoActive(true);
	// 	setLiveCasinoActive(false);
	// } else if (props.subMenuKey === "lbl_LiveCasino") {
	// 	setCasinoActive(false);
	// 	setLiveCasinoActive(true);
	// } else {
	// 	setCasinoActive(false);
	// 	setLiveCasinoActive(false);
	// }

	if (casinoActive) {
		return (
			<div className="subMenu-Wrapper active">
				<div className="casinoList active">
					<a href="" className="GPI">
						<span className="icon icon-GPI">GPI</span>
					</a>
					<a href="" className="YGG">
						<span className="icon icon-YGG">YGG</span>
					</a>
					<a href="" className="JOKER">
						<span className="icon icon-JOKER">JOKER</span>
					</a>
					<a href="" className="SG">
						<span className="icon icon-SG">SG</span>
					</a>
					<a href="" className="PP">
						<span className="icon icon-PP">PP</span>
					</a>
					<a href="" className="PG">
						<span className="icon icon-PG">PG</span>
					</a>
					<a href="" className="OW">
						<span className="icon icon-OW">OW</span>
					</a>
				</div>
			</div>
		);
	} else if (liveCasinoActive) {
		return (
			<div className="subMenu-Wrapper  active">
				<div className="livecasinoList active">
					<a href="" className="liveDG">
						<span className="icon icon-DG">DG</span>
					</a>
					<a href="" className="liveALL">
						<span className="icon icon-AB">ALL</span>
					</a>
					<a href="" className="liveAG">
						<span className="icon icon-AG">AG</span>
					</a>
					<a href="" className="livePP">
						<span className="icon icon-PP">PP</span>
					</a>
					<a href="" className="liveSA">
						<span className="icon icon-SA">SA</span>
					</a>
				</div>
			</div>
		);
	} else {
		return <></>;
	}
};
