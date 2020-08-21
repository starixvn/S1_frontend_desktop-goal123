import React, { useContext, useEffect } from "react";
import { userInfoContext, popBoxContext } from "../common/context";
import { isConvert } from "../common/common";
import { useTranslation } from "react-i18next";
import { defPopBoxType } from "../common/popBox";

export default props => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const { setPopBox } = useContext(popBoxContext);

	useEffect(() => {
	}, [props.amountValue]);

	const onChangeAmount = e => {
		let value = e.target.value;
		props.getAmountValue(value);
	};

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const SubmitConfirm = () => {
		console.log("props.amountValue", props.amountValue);
		if (props.amountValue === 0 || props.amountValue === "") {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.ErrorMsg,
				message: t("lbl_AmountTooltip"),
				btnBar: (
					<div className="btnGroup">
						<button className="btn-cancel" onClick={ClickClose}>
							{t("lbl_Close")}
						</button>
					</div>
				)
			});
		} else if (props.accountNoValue === "" || props.sysIdValue === 0) {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.ErrorMsg,
				message: t("lbl_SelectBank_Required"),
				btnBar: (
					<div className="btnGroup">
						<button className="btn-cancel" onClick={ClickClose}>
							{t("lbl_Close")}
						</button>
					</div>
				)
			});
		} else {
			props.getChildConfirm(true);
		}
	};

	return (
		<div class="inputModuleRow">
			<div class="inputBox">
				<i class="txt-blue12">{t("lbl_Amount")}</i>
				<input onChange={onChangeAmount} value={props.amountValue} />
				<div class="iconModule">
					<i class="">{_isConvert ? "('000)" : ""}</i>
					<i class="icon icon-information-solid"></i>
				</div>
			</div>
			<div class="btnGroup">
				<button class="btn-check" onClick={SubmitConfirm}>
					{t("lbl_Submit")}
				</button>
			</div>
		</div>
	);
};
