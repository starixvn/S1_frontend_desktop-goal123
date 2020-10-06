import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { defActionType } from "./onlineBank.reducer";
import { checkAmount, getAmountTip } from "../common/common";
import LimitTip from "./limitTip";
import config from "../../config";
import Inputbox from "../common/inputbox";

export default ({ bankInfo, _isConvert, amount, dispatch, userInfo }) => {
	const { t } = useTranslation();
	const [nameValue, setNameValue] = useState("");
	const initStatus = {
		accountName: {
			checked: null,
			tip: ""
		},
		amount: {
			checked: null,
			tip: ""
		}
	};
	const [status, setStatus] = useState(initStatus);

	const clickInfo = col => {
		console.log("col", col);
		let _tip = "";

		if (col === "accountName") {
			_tip = status.accountName.tip === "" ? t("lbl_RemindForName") : "";
		} else if (col === "amount") {
			_tip =
				status.amount.tip === ""
					? getAmountTip(bankInfo.minAmount, _isConvert, t)
					: "";
		}

		setStatus(prev => ({
			...prev,
			[col]: {
				checked: status[col].checked,
				tip: _tip
			}
		}));
	};

	const onChangeName = e => {
		let value = e.target.value;
		setNameValue(value);
	};

	const checkName = () => {
		let checkResult = false;
		let checkTip = "";

		if (userInfo.accountName) {
			checkResult = true;
		} else if (!userInfo.accountName && nameValue === "") {
			checkResult = false;
			checkTip = t("lbl_NameRequired");
		} else if (!userInfo.accountName && nameValue !== "") {
			checkResult = true;
			checkTip = "";
		}

		setStatus(prev => ({
			...prev,
			accountName: {
				tip: checkTip,
				checked: checkResult
			}
		}));

		return checkResult;
	};

	const SubmitAccountName = () => {
		let result = checkName();
		if (result) {
			// console.log("do submit name ! ! !");
			// post account name api here
		}
	};

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
			setStatus(prev => ({
				...prev,
				amount: {
					checked: false,
					tip: result.msg
				}
			}));
		} else {
			setStatus(prev => ({
				...prev,
				amount: {
					checked: true,
					tip: ""
				}
			}));
		}
		return result.status === 0;
	};

	const SubmitAmount = () => {
		let result = ValidAmount(amount) && checkName();
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

					{userInfo.isLogin === true &&
					!userInfo.accountName &&
					userInfo.accountName !== undefined ? (
						<>
							<div className="inputModuleRow">
								<Inputbox
									title={t("lbl_RealName")}
									onChange={onChangeName}
									value={nameValue}
									onBlur={checkName}
									clickInfo={clickInfo.bind(
										this,
										"accountName"
									)}
									checked={status.accountName.checked}
									tip={status.accountName.tip}
								/>
								<div className="btnGroup">
									<button
										className={`${
											status.accountName.checked === true
												? "btn-check"
												: "btn-cancel"
										}`}
										onClick={SubmitAccountName}>
										{t("lbl_Submit")}
									</button>
								</div>
							</div>
							<br />
						</>
					) : null}

					<div className="inputModuleRow">
						<Inputbox
							title={t("lbl_Amount")}
							value={amount}
							onChange={EditAmount}
							onBlur={ValidAmount.bind(this, amount)}
							clickInfo={clickInfo.bind(this, "amount")}
							checked={status.amount.checked}
							tip={status.amount.tip}
							_isConvert={_isConvert}
						/>
						<div className="btnGroup">
							<button
								className={`${
									status.amount.checked === true
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
