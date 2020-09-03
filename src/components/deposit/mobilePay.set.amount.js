import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import config from "../../config";
import LimitTip from "./limitTip";
import { defActionType } from "./mobilePay.reducer";
import { checkAmount, number_format } from "../common/common";
import Inputbox from "../common/inputbox";

export default ({ channelInfo, _isConvert, amount, dispatch }) => {
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
			channelInfo.minAmount,
			channelInfo.maxAmount,
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

	const SelectAmount = amount => {
		VaildAmount(amount);
		dispatch({ type: defActionType.EDIT_AMOUNT, amount: amount });
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
					{channelInfo.amountRule === 3 ? (
						<FixedAmountList
							{...channelInfo}
							_isConvert={_isConvert}
							onSelectAmount={SelectAmount}
							amount={amount}
						/>
					) : null}
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
						readOnly={channelInfo.amountRule === 3}
					/>
					<div className="btnGroup">
						<button
							className={`${
								warning.status === false
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

const FixedAmountList = ({
	minAmount,
	maxAmount,
	amountList,
	_isConvert,
	amount,
	onSelectAmount
}) => {
	let rows = amountList
		?.filter(a => a >= minAmount && a <= maxAmount)
		.map(a => {
			let _afterConvertAmount = _isConvert ? a / 1000 : a;
			let isSelected = amount === _afterConvertAmount;

			return (
				<button
					onClick={onSelectAmount.bind(this, _afterConvertAmount)}
					className={`blue${isSelected ? " active" : ""}`}
					key={`deposit-mobile-${a}`}>
					{number_format(a, _isConvert)}
					<i className="icon icon-checkmark"></i>
				</button>
			);
		});
	return <div className="btnGroup buttonBox">{rows}</div>;
};
