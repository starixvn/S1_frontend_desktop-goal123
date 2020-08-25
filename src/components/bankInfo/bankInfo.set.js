import React, {
	useEffect,
	useRef,
	useContext,
	useReducer,
	useState
} from "react";
import { userInfoContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { api_account_GetCustBankInfo } from "../../service/api/account";
import { defModule, reducer, initState } from "./bankInfo.reducer";
import InitPanel from "./bankInfo.set.init";
import BankPanel from "./bankInfo.set.bank";
import AccountPanel from "./bankInfo.set.account";

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const [state, dispatch] = useReducer(reducer, initState);
	const [showTip, setShowTip] = useState(false);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_account_GetCustBankInfo().then(res => {
			console.log(res);
		});
	}, []);

	console.log(state);

	let displayModule = null;
	switch (state.displayModule) {
		case defModule.InitPanel:
			displayModule = <InitPanel dispatch={dispatch} />;
			break;

		case defModule.BankPanel:
			displayModule = <BankPanel dispatch={dispatch} state={state} />;
			break;

		case defModule.AccountPanel:
			displayModule = (
				<AccountPanel
					dispatch={dispatch}
					bankInfo={state.bankList[state.bankIdx]}
					account={state.account}
					accountName={
						userInfo.accountName !== "" ? userInfo.accountName : ""
					}
				/>
			);
			break;

		default:
			break;
	}

	const clickTip = () => {
		let _showTip = !showTip;
		setShowTip(_showTip);
	};

	return (
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_bank-account">
				<span>{t("lbl_BankInfo")}</span>
				<div>{t("lbl_UpdateBankInfo")}</div>
			</div>
			<div className="accountName">
				{t("lbl_BankAccountName")}
				<span>{userInfo.accountName}</span>
				<button className="icon icon-error" onClick={clickTip}></button>
				{showTip ? (
					<div className="tip active">{t("lbl_ContactCSD")}</div>
				) : null}
			</div>
			{displayModule}
		</div>
	);
};
