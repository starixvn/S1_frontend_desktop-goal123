import React, {
	useEffect,
	useRef,
	useContext,
	useReducer,
	useState
} from "react";
import { useTranslation } from "react-i18next";
import { api_account_GetCustBankInfo } from "../../service/api/account";
import {
	defModule,
	reducer,
	initState,
	defActionType
} from "./bankInfo.reducer";
import InitPanel from "./bankInfo.set.init";
import BankPanel from "./bankInfo.set.bank";
import AccountPanel from "./bankInfo.set.account";
import ShowCard from "./bankInfo.showCard";

export default () => {
	const { t } = useTranslation();
	const [state, dispatch] = useReducer(reducer, initState);
	const [showTip, setShowTip] = useState(false);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_account_GetCustBankInfo().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let datas = res.data.data;
						dispatch({
							type: defActionType.GET_CUST_BANK_INFO,
							accountName: datas.accountName,
							custBankList: datas.bankInfoDetail
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
	}, []);

	console.log(state);

	const clickTip = () => {
		let _showTip = !showTip;
		setShowTip(_showTip);
	};

	let displayModule = null;
	switch (state.displayModule) {
		case defModule.InitPanel:
			displayModule = (
				<InitPanel
					dispatch={dispatch}
					numberOfAccount={state.custBankList?.length}
				/>
			);
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
						state.accountName !== "" ? state.accountName : ""
					}
				/>
			);
			break;

		default:
			break;
	}

	return (
		<>
			<div className="infoModule">
				<div className="inside-title icon icon-icon32px_bank-account">
					<span>{t("lbl_BankInfo")}</span>
					<div>{t("lbl_UpdateBankInfo")}</div>
				</div>

				{state.accountName ? (
					<div className="accountName">
						{t("lbl_BankAccountName")}
						<span>{state.accountName}</span>
						<button
							className="icon icon-error"
							onClick={clickTip}></button>
						{showTip ? (
							<div className="tip active">
								{t("lbl_ContactCSD")}
							</div>
						) : null}
					</div>
				) : null}
				{displayModule}
			</div>
			<ShowCard
				accountName={state.accountName}
				custBankList={state.custBankList}
			/>
		</>
	);
};
