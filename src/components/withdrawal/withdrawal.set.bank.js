import React, { useEffect, useRef, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import AddBankAccount from "./addBankAccount";
import Available from "./withdrawal.set.available";
import Calculation from "./withdrawal.set.calculation";
import CashBar from "./withdrawal.set.cashBar";
import InputModuleRow from "./withdrawal.set.inputModuleRow";
import BankInfoCard from "./withdrawal.set.bankInfoCard";
import WithdrawalConfirm from "./withdrawal.set.confirm";
import { api_payment_WithdrawalReq } from "../../service/api/payment";
import { api_account_GetWithdrawalAvailableBalance } from "../../service/api/account";
import { popBoxContext, userInfoContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import { isConvert } from "../common/common";

export default () => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const isMountedRef = useRef(null);
	const [allBankCardData, setAllBankCardData] = useState([]);
	const [balanceData, setBalanceData] = useState({});
	const [sysIdValue, setSysIdValue] = useState(0);
	const [accountNoValue, setAccountNoValue] = useState("");
	const [bankNameValue, setBankNameValue] = useState("");
	const [amountValue, setAmountValue] = useState(0);
	const [showConfirmPage, setShowConfirmPage] = useState(false);
	const { userInfo } = useContext(userInfoContext);
	const _isConvert = isConvert(userInfo.currencyId);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		getApiBalance();
	}, []);

	const getApiBalance = () => {
		api_account_GetWithdrawalAvailableBalance().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setBalanceData(res.data.data);
					} else {
						alert(res.data.message);
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					alert(t("msg_ApiServerError"));
				}
			}
		);
	};

	const refreshAvailableBalance = () => {
		getApiBalance();
	};

	const getBankCardValue = (childSysId, childAccountNo, bankName) => {
		setSysIdValue(childSysId);
		setAccountNoValue(childAccountNo);
		setBankNameValue(bankName);
	};

	const getAllBankCardData = childValue => {
		setAllBankCardData(childValue);
	};

	const onChangeAmount = e => {
		let value = e.target.value;
		setAmountValue(value);
	};

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const toConfirmPage = () => {
		if (amountValue < 1 || amountValue === "") {
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
		} else if (accountNoValue === "" || sysIdValue === 0) {
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
			setShowConfirmPage(true);
		}
	};

	const cancelSubmit = () => {
		setShowConfirmPage(false);
	};

	const confirmSubmit = () => {
		let ClickDone = () => {
			setAmountValue(0);
			getApiBalance();
			setPopBox({
				isOpen: false
			});
			setShowConfirmPage(false);
		};

		let AccountNo = accountNoValue;
		let amount = parseInt(amountValue, 10);
		let sysId = sysIdValue;
		api_payment_WithdrawalReq(AccountNo, amount, sysId).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.Success,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-check"
										onClick={ClickDone}>
										OK
									</button>
								</div>
							)
						});
					} else {
						alert(res.data.message);
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					alert(t("msg_ApiServerError"));
				}
			}
		);
	};

	return (
		<>
			<div className="walletModule">
				<Available
					availableBalance={balanceData.availableBalance}
					refreshAvailableBalance={refreshAvailableBalance}
					_isConvert={_isConvert}
				/>
			</div>
			<div className="walletModule">
				<div className="addBank">
					<BankInfoCard
						bankCardValue={getBankCardValue}
						allBankCardData={getAllBankCardData}
						_isConvert={_isConvert}
					/>
					<AddBankAccount allBankCardData={allBankCardData} />
				</div>

				<div className="subModuleList">
					<div className="subModule">
						{!showConfirmPage ? (
							<div className="subModuleBody">
								<Calculation
									balance={balanceData.balance}
									deduction={balanceData.deduction}
									availableBalance={
										balanceData.availableBalance
									}
									_isConvert={_isConvert}
								/>
								<CashBar
									onChangeAmount={onChangeAmount}
									amountValue={amountValue}
									availableBalance={
										balanceData.availableBalance
									}
									_isConvert={_isConvert}
								/>
								<InputModuleRow
									onChangeAmount={onChangeAmount}
									amountValue={amountValue}
									sysIdValue={sysIdValue}
									accountNoValue={accountNoValue}
									toConfirmPage={toConfirmPage}
									_isConvert={_isConvert}
								/>
							</div>
						) : (
							<WithdrawalConfirm
								bankNameValue={bankNameValue}
								amountValue={amountValue}
								sysIdValue={sysIdValue}
								accountNoValue={accountNoValue}
								cancelSubmit={cancelSubmit}
								confirmSubmit={confirmSubmit}
								_isConvert={_isConvert}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
