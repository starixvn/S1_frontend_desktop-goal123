import React from "react";
import { useTranslation } from "react-i18next";

export default props => {
	const { t } = useTranslation();
	return (
		<div class="inputModuleRow">
			<div class="inputBox">
				<i class="txt-blue12">{t("lbl_Amount")}</i>
				<input
					onChange={props.onChangeAmount}
					value={props.amountValue}
				/>
				<div class="iconModule">
					<i class="">{props._isConvert ? "('000)" : ""}</i>
					<i class="icon icon-information-solid"></i>
				</div>
			</div>
			<div class="btnGroup">
				<button class="btn-check" onClick={props.toConfirmPage}>
					{t("lbl_Submit")}
				</button>
			</div>
		</div>
	);
};
