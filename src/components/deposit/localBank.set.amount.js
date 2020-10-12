import React, { useContext, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { defActionType } from "./onlineBank.reducer";
import { checkAmount, getAmountTip } from "../common/common";
import LimitTip from "./limitTip";
import config from "../../config";
import Inputbox from "../common/inputbox";
import { api_accountStrict_SetAccountName } from "../../service/api/accountStrict";
import { defPopBoxType } from "../common/popBox";
import { popBoxContext } from "../common/context";

export default ({
	bankInfo,
	_isConvert,
	amount,
	dispatch,
	userInfo,
	setUserInfo
}) => {
	const { t } = useTranslation();
	const [nameValue, setNameValue] = useState("");
	const isMountedRef = useRef(null);
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
	const { setPopBox } = useContext(popBoxContext);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const clickInfo = col => {
		let _tip = "";

		if (col === "amount") {
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

	const clickClose = () => {
		setPopBox({ isOpen: false });
	};

	const onChangeName = e => {
		let value = e.target.value;
		setNameValue(value);
	};

	const onChangeAmount = e => {
		let value = e.target.value;
		value = value.replace(/^(0+)|[^\d]+/g, "");
		ValidAmount(value);
		dispatch({ type: defActionType.EDIT_AMOUNT, amount: value });
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

	const berforeSubmitCheck = () => {
		let result = ValidAmount(amount) && checkName();
		if (result) {
			if (!userInfo.accountName) {
				setPopBox({
					isOpen: true,
					popBoxType: defPopBoxType.ProfileConfirmCheck,
					accountName: nameValue,
					btnBar: (
						<div className="btnGroup">
							<button className="btn-cancel" onClick={clickClose}>
								{t("lbl_ReModify")}
							</button>
							<button
								className="btn-check"
								onClick={toConfirmAmountPage}>
								{t("lbl_Confirm")}
							</button>
						</div>
					)
				});
			} else {
				toConfirmAmountPage();
			}
		}
	};

	const toConfirmAmountPage = () => {
		api_accountStrict_SetAccountName({
			name: nameValue ? nameValue : userInfo.accountName
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0 || res.data.errorCode === -5) {
						if (res.data.errorCode === 0) {
							setUserInfo(prev => ({
								...prev,
								accountName: nameValue
							}));
							setPopBox({ isOpen: false });
						}

						dispatch({ type: defActionType.SUBMIT_AMOUNT });
					} else {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: res.data.message
								? res.data.message
								: `[${res.data.errorCode}] ${t(
										"msg_ApiServerError"
								  )}`,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={clickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={clickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			}
		);
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
									checked={status.accountName.checked}
									tip={status.accountName.tip}
								/>
							</div>
							{status.accountName.tip === "" ? (
								<div>{t("lbl_RemindForName")}</div>
							) : null}
							<br />
						</>
					) : null}

					{status.accountName.tip === "" ? null : (
						<div>{t("lbl_RemindForName")}</div>
					)}

					<div className="inputModuleRow">
						<Inputbox
							title={t("lbl_Amount")}
							value={amount}
							onChange={onChangeAmount}
							onBlur={ValidAmount.bind(this, amount)}
							clickInfo={clickInfo.bind(this, "amount")}
							checked={status.amount.checked}
							tip={status.amount.tip}
							_isConvert={_isConvert}
						/>
						<div className="btnGroup">
							<button
								className={`${
									status.amount.checked &&
									status.accountName.checked
										? "btn-check"
										: "btn-cancel"
								}`}
								onClick={berforeSubmitCheck}>
								{t("lbl_Submit")}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
