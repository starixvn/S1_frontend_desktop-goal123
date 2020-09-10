import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { defActionType } from "./onlineBank.reducer";
import { checkAmount, number_format, getAmountTip } from "../common/common";
import LimitTip from "./limitTip";
import config from "../../config";
import Inputbox from "../common/inputbox";

export default ({ bankInfo, _isConvert, amount, dispatch }) => {
	const { t } = useTranslation();
	const [status, setStatus] = useState({
		checked: null,
		tip: ""
	});

	const EditAmount = e => {
		let value = e.target.value;
		value = value.replace(/^(0+)|[^\d]+/g, "");

		ValidAmount(value);
		dispatch({ type: defActionType.EDIT_AMOUNT, amount: value });
	};

	const ValidAmount = _amount => {
		let result = checkAmount(
			_amount,
			bankInfo.minAmount,
			bankInfo.maxAmount,
			_isConvert,
			t
		);
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

	const clickInfo = () => {
		let _msg =
			status.tip === ""
				? getAmountTip(bankInfo.minAmount, _isConvert, t)
				: "";
		setStatus({
			checked: null,
			tip: _msg
		});
	};

	const SubmitAmount = () => {
		let result = ValidAmount(amount);
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
							displayTextLimit={t("lbl_Limit")}
							displayTextUnLimit={t("lbl_Unlimited")}
							_isConvert={_isConvert}
						/>
					</div>
					<div className="inputModuleRow">
						<Inputbox
							title={t("lbl_Amount")}
							value={amount}
							onChange={EditAmount}
							onBlur={ValidAmount.bind(this, amount)}
							clickInfo={clickInfo}
							checked={status.checked}
							tip={status.tip}
							_isConvert={_isConvert}
						/>
						<div className="btnGroup">
							<button
								className={`${
									status.checked === true
										? "btn-check"
										: "btn-cancel"
								}`}
								onClick={SubmitAmount}>
								{t("lbl_Submit")}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
