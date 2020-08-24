import React, { useContext } from "react";
import { userInfoContext } from "../common/context";
import { isConvert } from "../common/common";
import { useTranslation } from "react-i18next";

export default props => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const _isConvert = isConvert(userInfo.currencyId);

	return (
		<div class="inputModuleRow">
			<div class="inputBox">
				<i class="txt-blue12">{t("lbl_Amount")}</i>
				<input
					onChange={props.onChangeAmount}
					value={props.amountValue}
				/>
				<div class="iconModule">
					<i class="">{_isConvert ? "('000)" : ""}</i>
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
