import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import config from "../../config";
import LimitTip from "./limitTip";
import { defActionType } from "./mobilePay.reducer";
import { checkAmount } from "../common/common";
import Inputbox from "../common/inputbox";

export default ({ channelInfo, _isConvert, amount, dispatch }) => {
	const { t } = useTranslation();
	const [status, setStatus] = useState({
		checked: null,
		tip: ""
	});

	const EditAmount = e => {
		let value = e.target.value;
		VaildAmount(value);
		dispatch({ type: defActionType.EDIT_AMOUNT, amount: value });
	};

	const VaildAmount = _amount => {
		let result = checkAmount(
			_amount,
			channelInfo.minAmount,
			channelInfo.maxAmount,
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

	const SubmitAmount = () => {
		let result = VaildAmount(amount);
		if (result) {
			dispatch({ type: defActionType.SUBMIT_AMOUNT });
		}
	};

	const clickInfo = () => {
		let _msg = status.tip === "" ? t("lbl_AmountTooltip") : "";
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
								src={`${config.imgUrl}/common/images/MobilePay/${channelInfo.groupName}.png`}
								alt={channelInfo.groupName}
							/>
						</div>
						<LimitTip
							minAmount={channelInfo.minAmount}
							maxAmount={channelInfo.maxAmount}
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
							{t("lbl_Submit")}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
