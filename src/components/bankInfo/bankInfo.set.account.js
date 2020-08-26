import React, { useState, useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { defActionType } from "./bankInfo.reducer";
import { userInfoContext } from "../common/context";
import { api_accountStrict_SetCustBankInfo } from "../../service/api/accountStrict";
import config from "../../config";
import Inputbox from "../common/inputbox";

export default ({ dispatch, bankInfo, account, accountName, reload }) => {
	const { t } = useTranslation();
	const { userInfo, setUserInfo } = useContext(userInfoContext);
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

		if (col === "accountName") {
			if (val === "" || val === undefined) {
				message = t("msg_EnterRealName");
				checked = false;
			}
		} else if (col === "accountNumber") {
			if (val === "" || val === undefined) {
				message = t("msg_NeedAccountNo");
				checked = false;
			} else if (isNaN(val)) {
				message = t("msg_AccountWrongFormat");
				checked = false;
			}
		}

		return { checked, message };
	};

	const editAccountNumber = e => {
		let val = e.target.value;
		dispatch({ type: defActionType.EDIT_ACCOUNT_NUMBER, account: val });
	};

	const editAccountName = e => {
		let val = e.target.value;
		dispatch({ type: defActionType.EDIT_ACCOUNT_NAME, accountName: val });
	};

	const clickSubmit = e => {
		e.preventDefault();
		let _accountName = userInfo.accountName
			? { checked: true }
			: checkAccount(accountName, "accountName");
		let _ccountNumber = checkAccount(account, "accountNumber");

		if (_ccountNumber.checked && _accountName.checked) {
			api_accountStrict_SetCustBankInfo({
				AccountName: userInfo.accountName ?? accountName,
				AccountNo: account,
				SysId: bankInfo.sysId
			}).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							if (!userInfo.accountName) {
								setUserInfo(prev => ({
									...prev,
									accountName: accountName
								}));
							}
							reload();
							dispatch({ type: defActionType.BACK_TO_INIT });
						} else {
							alert(res.data.message);
						}
					}
				},
				err => {
					alert(t("msg_ApiServerError"));
				}
			);
		} else {
			setTip({
				accountName: _accountName.message,
				accountNumber: _ccountNumber.message
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
						{!userInfo.accountName ? (
							<Inputbox
								value={accountName}
								onChange={editAccountName}
								title={t("lbl_RealName")}
								tip={tip.accountName}
							/>
						) : null}
						<div className="inputModuleRow">
							<Inputbox
								value={account}
								onChange={editAccountNumber}
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
