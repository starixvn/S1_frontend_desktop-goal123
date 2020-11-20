import React, { useEffect, useRef, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import AddBankAccount from "./addBankAccount";
import Available from "./withdrawal.set.available";
import Calculation from "./withdrawal.set.calculation";
// import CashBar from "./withdrawal.set.cashBar";
import InputModuleRow from "./withdrawal.set.inputModuleRow";
import BankInfoCard from "./withdrawal.set.bankInfoCard";
import KycUpload from "./withdrawal.set.kycUpload";
import KycPending from "./withdrawal.set.kycPending";
import WithdrawalConfirm from "./withdrawal.set.confirm";
import { api_payment_WithdrawalReq } from "../../service/api/payment";
import { popBoxContext, userInfoContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import { isConvert } from "../common/common";
import StepBar from "../common/stepBar";
import defStep from "../withdrawal/defStep";
import { checkWithdrawalAmount, getAmountTip } from "../common/common";
import { Link } from "@reach/router";
import path from "../../path";

export default ({
	balanceData,
	kycStatus,
	getWithdrawalInfoRecent,
	getWithdrawalAvailableBalance,
	getKycStatus
}) => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const isMountedRef = useRef(null);
	const [sysIdValue, setSysIdValue] = useState(0);
	const [accountNoValue, setAccountNoValue] = useState("");
	const [bankNameValue, setBankNameValue] = useState("");
	const [amountValue, setAmountValue] = useState("");
	const [showConfirmPage, setShowConfirmPage] = useState(false);
	const { userInfo } = useContext(userInfoContext);
	const [bankInfoList, setBankInfoList] = useState([]);
	const _isConvert = isConvert(userInfo.currencyId);
	const [status, setStatus] = useState({
		checked: null,
		tip: ""
	});
	const [step, setStep] = useState(1);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (userInfo.isLogin === true) {
			if (
				(!userInfo.phoneNo && userInfo.phoneNo !== undefined) ||
				(!userInfo.email && userInfo.email !== undefined)
			) {
				setPopBox({
					isOpen: true,
					popBoxType: defPopBoxType.UpdateProfile,
					title: t("lbl_ImportantNote"),
					content: t("lbl_UpdatePersonalInfoWithdrawal"),
					btnBar: (
						<div className="btnGroup">
							<Link
								className="btn-check"
								to={`/${userInfo.langId}/${path.profile.root}?prevPage=${path.withdrawal.root}`}>
								{t("lbl_UpdatePersonalDetail")}
							</Link>
						</div>
					)
				});
			}
		}
	}, [userInfo]);

	useEffect(() => {
		updateStep();
	}, [sysIdValue, amountValue, showConfirmPage]);

	useEffect(() => {
		setStep(1);
		// setAmountValue("");
	}, [bankInfoList.length]);

	const updateStep = () => {
		if (sysIdValue === 0 || !sysIdValue) {
			setStep(1);
		} else if (
			sysIdValue > 0 &&
			(amountValue === 0 ||
				amountValue === "" ||
				status.checked === false)
		) {
			setStep(1);
		} else if (
			sysIdValue > 0 &&
			status.checked === true &&
			showConfirmPage === false
		) {
			setStep(2);
		} else if (
			sysIdValue > 0 &&
			status.checked === true &&
			showConfirmPage === true
		) {
			setStep(3);
		}
	};

	const refreshAvailableBalance = () => {
		getWithdrawalAvailableBalance();
	};

	const setCurrentlyBankInfo = (childSysId, childAccountNo, bankName) => {
		setSysIdValue(childSysId);
		setAccountNoValue(childAccountNo);
		setBankNameValue(bankName);
	};

	const onChangeAmount = e => {
		let value = e.target.value;
		value = value.replace(/^(0+)|[^\d]+/g, "");
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
		let _msg = status.tip === "" ? getAmountTip(0, _isConvert, t) : "";
		setStatus({
			checked: null,
			tip: _msg
		});
	};

	const toConfirmPage = () => {
		ValidAmount(amountValue);
		if (status.checked === true) {
			if (accountNoValue === "" || sysIdValue === 0) {
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
				setStep(3);
			}
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
			setAmountValue("");
			setCurrentlyBankInfo(0, 0, "");
			refreshAvailableBalance();
			setPopBox({
				isOpen: false
			});
			setStatus({
				checked: null,
				tip: ""
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
							popBoxType: defPopBoxType.WithdrawalSuccess,
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
						getWithdrawalInfoRecent();
						getKycStatus();
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
								": " +
								parseInt(res.data.message, 10).toString(),
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

	if (kycStatus !== "normal")
		return (
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
		);

	return (
		<>
			<div className="inside-title icon icon-transfer">
				<span>{t("lbl_Withdrawal")}</span>
				<div>{t("lbl_UpdateBankInfo")}</div>
			</div>
			<StepBar step={step} t={t} defStep={defStep} />
			<div className="walletModule">
				<Available
					availableBalance={balanceData.availableBalance}
					refreshAvailableBalance={refreshAvailableBalance}
					_isConvert={_isConvert}
					accountName={userInfo.accountName}
				/>
			</div>
			<div className="walletModule">
				<div className="addBank">
					<BankInfoCard
						setCurrentlyBankInfo={setCurrentlyBankInfo}
						currentBankInfo={{
							sysIdValue,
							accountNoValue,
							bankNameValue
						}}
						bankInfoList={bankInfoList}
						setBankInfoList={setBankInfoList}
						_isConvert={_isConvert}
						confirmPanel={showConfirmPage}
					/>
					<AddBankAccount bankInfoList={bankInfoList} />
				</div>

				<div className="subModuleList">
					<div className="subModule">
						{!showConfirmPage ? (
							<div className="subModuleBody">
								<Calculation
									balanceData={balanceData}
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
									status={status}
									onBlur={ValidAmount.bind(this, amountValue)}
									clickInfo={clickInfo}
									checked={status.checked}
									tip={status.tip}
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
	);
};
