import React, { useState, useEffect, useRef } from "react";
// import { api_account_GetMsgContent } from "../../service/api/account";
import { useTranslation } from "react-i18next";
import moment from "moment";
import config from "../../config";

export default props => {
	const { t } = useTranslation();
	const isMountedRef = useRef(null);
	const [displayTime, setDisplayTime] = useState("");
	const [msgContentData, setMsgContentData] = useState("");
	const [showContent, setShowContent] = useState(false);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		// getDisplayTime();
	}, []);

	return (
		<div>
			{/* {console.log(props)} */}
			<div className="brand">
				<span>{props.provider}</span>
			</div>
			<div className="icon icon-star-full active"></div>

			<img
				src={`${config.imgUrl}/common/images/Casino/${props.provider}/${props.imgName.en}`}
				alt={`game-${props.gameId}`}
			/>
			<div className="txt-darkBlue">{props.name.cs}</div>
			<div className="btnGroup">
				<button className="blue">Play Now</button>
				<button className="blue">Free Play</button>
			</div>
		</div>
	);
};

// import React from "react";

// const casinoCard = ({ posts }) => {
// 	return (
// 		<ul className="list-group mb-4">
// 			{posts.map(post => (
// 				<li key={post} className="list-group-item">
// 					32132
// 				</li>
// 			))}
// 		</ul>
// 	);
// };

// export default casinoCard;
