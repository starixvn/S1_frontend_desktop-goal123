import React, { useEffect, useRef, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import AddBankAccount from "./addBankAccount";
import Available from "./withdrawal.set.available";
import Calculation from "./withdrawal.set.calculation";
import CashBar from "./withdrawal.set.cashBar";
import InputModuleRow from "./withdrawal.set.inputModuleRow";
import BankInfoCard from "./withdrawal.set.bankInfoCard";
import KycUpload from "./withdrawal.set.kycUpload";
import KycPending from "./withdrawal.set.kycPending";
import WithdrawalConfirm from "./withdrawal.set.confirm";
import {
	api_payment_WithdrawalReq,
	api_payment_KycCheck
} from "../../service/api/payment";
import { api_account_GetWithdrawalAvailableBalance } from "../../service/api/account";
import { popBoxContext, userInfoContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import { isConvert } from "../common/common";
import StepBar from "../common/stepBar";
import defStep from "../withdrawal/defStep";
import { checkWithdrawalAmount } from "../common/common";
import Loading from "../common/loading";

export default step => {
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
	const [kycStatus, setKycStatus] = useState("");
	const [warning, setWarning] = useState({
		status: null,
		msg: ""
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		getKycStatus();
		getApiBalance();
	}, []);

	const getKycStatus = () => {
		setLoading(true);

		api_payment_KycCheck().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setKycStatus("normal");
					} else if (res.data.errorCode === 1) {
						setKycStatus("kycUpload");
					} else if (res.data.errorCode === 2) {
						setKycStatus("kycPending");
					}
					setLoading(false);
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
									onClick={ClickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
					setLoading(false);
				}
			}
		);
	};

	const getApiBalance = () => {
		setLoading(true);

		api_account_GetWithdrawalAvailableBalance().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setBalanceData(res.data.data);
					} else {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
					setLoading(false);
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
									onClick={ClickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
					setLoading(false);
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
		let value = Number(e.target.value);
		ValidAmount(value);
		setAmountValue(value);
	};

	const ValidAmount = _amount => {
		let result = checkWithdrawalAmount(
			_amount,
			balanceData.availableBalance,
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

	const toConfirmPage = () => {
		if (warning.status === false) {
			setShowConfirmPage(true);
		}
	};

	const cancelSubmit = () => {
		setShowConfirmPage(false);
	};

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const confirmSubmit = () => {
		let ClickDone = () => {
			setAmountValue(0);
			getApiBalance();
			setPopBox({
				isOpen: false
			});
			setShowConfirmPage(false);
			getKycStatus();
		};

		let AccountNo = accountNoValue;
		let amount = _isConvert
			? amountValue * 1000
			: parseInt(amountValue, 10);
		let sysId = sysIdValue;
		api_payment_WithdrawalReq(AccountNo, amount, sysId).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 2 || res.data.errorCode === 0) {
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
					} else if (res.data.errorCode === -1) {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message:
								t("lbl_RolloverOver") + ":" + res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					} else if (res.data.errorCode === -2) {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message:
								t("lbl_DepositOver") + ":" + res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					} else if (res.data.errorCode === -3) {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message:
								t("lbl_WithdrawalOver") +
								":" +
								res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					} else {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
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
									onClick={ClickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			}
		);
	};

	return loading ? (
		<Loading />
	) : (
		<>
			{kycStatus !== "normal" ? (
				<>
					<div className="inside-title icon icon-transfer">
						<span>{t("lbl_Withdrawal")}</span>
						<div>{t("lbl_SubmitPhotoIdHint")}</div>
					</div>
					{kycStatus === "kycUpload" ? (
						<KycUpload getKycStatus={getKycStatus} />
					) : (
						<KycPending />
					)}
				</>
			) : (
				<>
					<div className="inside-title icon icon-transfer">
						<span>{t("lbl_Withdrawal")}</span>
					</div>
					<StepBar step={step} t={t} defStep={defStep} />
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
										{/* <CashBar
											onChangeAmount={onChangeAmount}
											amountValue={amountValue}
											availableBalance={
												balanceData.availableBalance
											}
											_isConvert={_isConvert}
										/> */}
										<InputModuleRow
											onChangeAmount={onChangeAmount}
											amountValue={amountValue}
											sysIdValue={sysIdValue}
											accountNoValue={accountNoValue}
											toConfirmPage={toConfirmPage}
											_isConvert={_isConvert}
											warning={warning}
										/>
									</div>
								) : (
									<WithdrawalConfirm
										bankNameValue={bankNameValue}
										amountValue={
											_isConvert
												? amountValue * 1000
												: amountValue
										}
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
			)}
		</>
	);
};
