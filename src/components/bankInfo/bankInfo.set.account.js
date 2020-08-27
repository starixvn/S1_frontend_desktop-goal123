import React, { useState, useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { defActionType } from "./bankInfo.reducer";
import { api_accountStrict_SetCustBankInfo } from "../../service/api/accountStrict";
import config from "../../config";
import Inputbox from "../common/inputbox";

export default ({
	dispatch,
	bankInfo,
	accountNumber,
	accountName,
	alreadyHasAccountName,
	reload
}) => {
	const { t } = useTranslation();
	const [tip, setTip] = useState({ accountName: "", accountNumber: "" });
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const toLastStep = () => {
		dispatch({ type: defActionType.TO_LAST_STEP });
	};

	const checkAccount = (val, col) => {
		let checked = true;
		let message = "";

		if (col === "accountName" && !alreadyHasAccountName) {
			if (!val) {
				message = t("msg_EnterRealName");
				checked = false;
			}
		} else if (col === "accountNumber") {
			if (!val) {
				message = t("msg_NeedAccountNo");
				checked = false;
			} else if (isNaN(val)) {
				message = t("msg_AccountWrongFormat");
				checked = false;
			}
		}

		return { checked, message };
	};

	const editField = (_col, e) => {
		let val = e.target.value;
		dispatch({
			type: defActionType.EDIT_FIELD,
			col: _col,
			value: val
		});
	};

	const clickSubmit = e => {
		e.preventDefault();
		let _accountName = checkAccount(accountName, "accountName");
		let _accountNumber = checkAccount(accountNumber, "accountNumber");

		if (_accountNumber.checked && _accountName.checked) {
			api_accountStrict_SetCustBankInfo({
				AccountName: accountName,
				AccountNo: accountNumber,
				SysId: bankInfo.sysId
			}).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							dispatch({
								type: defActionType.BACK_TO_INIT,
								func: reload
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
		} else {
			setTip({
				accountName: _accountName.message,
				accountNumber: _accountNumber.message
			});
		}
	};

	return (
		<>
			<div className="platformName">
				<div className="icon icon-arrow-right2"></div>
				<div>
					<div className="txt-blue2">
						{t("lbl_EnterAccountNumber")}
					</div>
				</div>
				<button
					className="icon icon-arrow-left2"
					onClick={toLastStep}></button>
			</div>
			<div className="subModuleList">
				<div className="subModule">
					<form
						className="subModuleBody column"
						onSubmit={clickSubmit}>
						<div>
							<div className="bankName">
								<img
									src={`${config.imgUrl}/common/images/BankLogo/${bankInfo.bankLogo}`}
								/>
							</div>
						</div>
						{!alreadyHasAccountName ? (
							<Inputbox
								value={accountName}
								onChange={editField.bind(this, "accountName")}
								title={t("lbl_RealName")}
								tip={tip.accountName}
							/>
						) : null}
						<div className="inputModuleRow">
							<Inputbox
								value={accountNumber}
								onChange={editField.bind(this, "accountNumber")}
								title={t("lbl_BankNumber")}
								tip={tip.accountNumber}
							/>
							<div className="btnGroup">
								<button className="btn-check" type="submit">
									{t("lbl_Submit")}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};
