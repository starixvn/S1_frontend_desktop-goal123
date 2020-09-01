import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Dropdown from "../common/dropdown";

export default props => {
	const { t } = useTranslation();

	useEffect(() => {
		console.log(props.provierItem); ///////////////////////////
	}, []);

	return (
		<div className="casinoSelect">
			<div className="btnGroup promoType">
				<button
					name="All"
					onClick={props.getAllGame}
					className={
						props.btnActive === "All" ? "btn-check" : "blueBorder"
					}>
					{t("lbl_AllGames")}
				</button>
				<button
					name="promo"
					onClick={props.getPromoGame}
					className={
						props.btnActive === "promo" ? "btn-check" : "blueBorder"
					}>
					{t("lbl_Promo")}
				</button>
				<button
					name="feature"
					onClick={props.getFetureGame}
					className={
						props.btnActive === "feature"
							? "btn-check"
							: "blueBorder"
					}>
					{t("lbl_Feature")}
				</button>
				<button
					name="favorite"
					onClick={props.showFavorite}
					className={
						props.btnActive === "favorite"
							? "btn-check"
							: "blueBorder"
					}>
					{t("lbl_Favourite")}
				</button>
			</div>
			<div className="inputBox">
				<i className="txt-blue12 icon icon-search"></i>
				<input />
			</div>
			<div>
				<div className="inputBox">
					<Dropdown
						i18n={t}
						mainKey="casino_"
						options={props.providerList}
						selected={props.provierItem}
						selectedIdx={props.selectedIdx}
						onSelectItem={props.onSelectItem}
					/>
				</div>
			</div>
			<div className="btnGroup">
				<button className="btn-check">{t("lbl_Submit")}</button>
			</div>
		</div>
	);
};
