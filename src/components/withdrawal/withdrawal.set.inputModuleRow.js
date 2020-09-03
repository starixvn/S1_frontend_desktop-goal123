import React from "react";
import { useTranslation } from "react-i18next";
import Inputbox from "../common/inputbox";

export default props => {
	const { t } = useTranslation();
	return (
		<div className="inputModuleRow">
			<Inputbox
				value={props.amountValue}
				onChange={props.onChangeAmount}
				onBlur={props.onBlur}
				title={t("lbl_Amount")}
				clickInfo={props.clickInfo}
				checked={props.checked}
				tip={props.tip}
				_isConvert={props._isConvert}
			/>
			<div className="btnGroup">
				<button className="btn-check" onClick={props.toConfirmPage}>
					{t("lbl_Submit")}
				</button>
			</div>
		</div>
	);
};
