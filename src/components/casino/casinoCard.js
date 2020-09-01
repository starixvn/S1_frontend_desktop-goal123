import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import config from "../../config";

export default props => {
	const { t } = useTranslation();
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	return (
		<div>
			{/* {console.log("props:", props)} */}
			<div className="brand">
				<span>{props.provider}</span>
			</div>
			<div
				className={`icon icon-star-full ${
					props.isFavorite ? "active" : ""
				}`}
				onClick={props.saveFavorite}></div>
			<img
				src={`${config.imgUrl}/common/images/Casino/${props.provider}/${
					props.imgName[props.userLanguage]
				}`}
				alt={`game-${props.gameId}`}
			/>
			<div className="txt-darkBlue">{props.name[props.userLanguage]}</div>
			<div className="btnGroup">
				<button className="blue" onClick={props.playLink}>
					{t("lbl_PlayNow")}
				</button>
				{props.playFree ? (
					<button className="blue" onClick={props.playLink}>
						{t("lbl_Free")}
					</button>
				) : null}
			</div>
		</div>
	);
};
