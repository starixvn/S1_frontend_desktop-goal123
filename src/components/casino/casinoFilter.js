import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Dropdown from "../common/dropdown";
import Inputbox from "../common/inputbox";

export default props => {
	const { t } = useTranslation();

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
					name="promotion"
					onClick={props.showPromoGame}
					className={
						props.btnActive === "promotion"
							? "btn-check"
							: "blueBorder"
					}>
					{t("lbl_Promo")}
				</button>
				<button
					name="feature"
					onClick={props.showFetureGame}
					className={
						props.btnActive === "feature"
							? "btn-check"
							: "blueBorder"
					}>
					{t("lbl_Feature")}
				</button>
				<button
					name="favorite"
					onClick={
						props.isLogin
							? props.showFavoriteGame
							: props.showStateFavoriteGame
					}
					className={
						props.btnActive === "favorite"
							? "btn-check"
							: "blueBorder"
					}>
					{t("lbl_Favourite")}
				</button>
			</div>
			<div>
				<div className="inputBox">
					<Dropdown
						i18n={t}
						mainKey="casino_"
						options={props.providerList}
						selectedIdx={props.selectedIdx}
						onSelectItem={props.onSelectItem}
					/>
				</div>
			</div>
			<Inputbox
				onChange={props.onChangeSearch}
				value={props.searchValue}
				icon="icon-search txt-blue12"
			/>

			<div className="btnGroup">
				<button className="btn-check" onClick={props.onClickSearch}>
					{t("lbl_Submit")}
				</button>
			</div>
		</div>
	);
};
