import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import config from "../../config";
import LimitTip from "./limitTip";
import { defActionType } from "./onlineBank.reducer";
import { checkAmount } from "../common/common";

export default ({ bankInfo, _isConvert, amount, dispatch }) => {
	const { t } = useTranslation();
	const [warning, setWarning] = useState({
		status: null,
		msg: ""
	});

	const EditAmount = e => {
		let value = e.target.value;
		VaildAmount(value);
		dispatch({ type: defActionType.EDIT_AMOUNT, amount: value });
	};

	const VaildAmount = _amount => {
		let result = checkAmount(
			_amount,
			bankInfo.minAmount,
			bankInfo.maxAmount,
			_isConvert,
			t
		);
		if (result.status !== 0) {
			setWarning({
				status: true,
				msg: result.msg
			});
		} else {
			setWarning({
				status: false,
				msg: ""
			});
		}
		return result.status === 0;
	};

	const SubmitAmount = () => {
		let result = VaildAmount(amount);
		if (result) {
			dispatch({ type: defActionType.SUBMIT_AMOUNT });
		}
	};

	return (
		<div className="subModuleList">
			<div className="subModule">
				<div className="subModuleBody column">
					<div>
						<div className="bankName">
							<img
								src={`${config.imgUrl}/common/images/BankLogo/${bankInfo.bankLogo}`}
								alt={bankInfo.bankName}
							/>
						</div>
						<LimitTip
							minAmount={bankInfo.minAmount}
							maxAmount={bankInfo.maxAmount}
							displayTextLimit={"Limit"}
							displayTextUnLimit={"Unlimit"}
							_isConvert={_isConvert}
						/>
					</div>
					<div className="inputBox">
						<input
							placeholder="Please Enter The Deposit Amount"
							defaultValue={amount}
							onBlur={EditAmount}
						/>
						<div className="iconModule">
							{!warning.status && warning.status !== null ? (
								<i className="icon icon-checkmark"></i>
							) : warning.status ? (
								<i className="icon icon-cross"></i>
							) : null}
						</div>
					</div>
					<div className={`tip${warning.status ? " active" : ""}`}>
						{warning.msg}
					</div>
					<div className="btnGroup">
						<button
							className={`${
								!warning.status && warning.status !== null
									? "btn-check"
									: "btn-cancel"
							}`}
							onClick={SubmitAmount}>
							{" "}
							{t("lbl_Submit")}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
