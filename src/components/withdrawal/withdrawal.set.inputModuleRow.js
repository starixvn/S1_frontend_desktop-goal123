import React from "react";
import { useTranslation } from "react-i18next";

export default props => {
	const { t } = useTranslation();
	return (
		<div className="inputModuleRow">
			<div className="inputBox">
				<i className="txt-blue12">{t("lbl_Amount")}</i>
				<input
					onChange={props.onChangeAmount}
					value={props.amountValue}
				/>
				<div className="iconModule">
					<i className="">{props._isConvert ? "('000)" : ""}</i>
					<i className="icon icon-information-solid"></i>
				</div>
			</div>
			<div className="tip active">
				{props.warning.status ? props.warning.msg : null}
			</div>
			<div className="btnGroup">
				<button className="btn-check" onClick={props.toConfirmPage}>
					{t("lbl_Submit")}
				</button>
			</div>
		</div>
	);
};
