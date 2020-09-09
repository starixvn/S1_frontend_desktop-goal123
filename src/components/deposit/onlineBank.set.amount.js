import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import config from "../../config";
import LimitTip from "./limitTip";
import { defActionType } from "./onlineBank.reducer";
import { checkAmount, getAmountTip } from "../common/common";
import Inputbox from "../common/inputbox";

export default ({
	bankInfo,
	_isConvert,
	amount,
	dispatch,
	minAmount,
	maxAmount
}) => {
	const { t } = useTranslation();
	const [status, setStatus] = useState({
		checked: null,
		tip: ""
	});
	const EditAmount = e => {
		let value = e.target.value;
		value = value.replace(/^(0+)|[^\d]+/g, "");

		VaildAmount(value);
		dispatch({ type: defActionType.EDIT_AMOUNT, amount: value });
	};

	const VaildAmount = _amount => {
		let result = checkAmount(_amount, minAmount, maxAmount, _isConvert, t);
		if (result.status !== 0) {
			setStatus({
				checked: false,
				tip: result.msg
			});
		} else {
			setStatus({
				checked: true,
				tip: ""
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

	const clickInfo = () => {
		let _msg =
			status.tip === "" ? getAmountTip(minAmount, _isConvert, t) : "";
		setStatus({
			checked: null,
			tip: _msg
		});
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
						onBlur={VaildAmount.bind(this, amount)}
						clickInfo={clickInfo}
						checked={status.checked}
						tip={status.tip}
					/>
					<div className="btnGroup">
						<button
							className={`${
								status.checked === true
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
