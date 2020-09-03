import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import config from "../../config";
import LimitTip from "./limitTip";
import { defActionType } from "./onlineBank.reducer";
import { checkAmount } from "../common/common";
import Inputbox, { defValueType } from "../common/inputbox";

export default ({
	bankInfo,
	_isConvert,
	amount,
	dispatch,
	minAmount,
	maxAmount
}) => {
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
		let result = checkAmount(_amount, minAmount, maxAmount, _isConvert, t);
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
							minAmount={minAmount}
							maxAmount={maxAmount}
							displayTextLimit={"Limit"}
							displayTextUnLimit={"Unlimit"}
							_isConvert={_isConvert}
						/>
					</div>
					<Inputbox
						placeholder={t("lbl_DepositAmountReq")}
						value={amount}
						onChange={EditAmount}
						warning={warning.status}
						warningIcon="icon-cross"
						checkIcon={`${
							warning.status === false ? "icon-checkmark" : null
						}`}
						tip={warning.status ? warning.msg : null}
					/>
					<div className="btnGroup">
						<button
							className={`${
								warning.status === false
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
