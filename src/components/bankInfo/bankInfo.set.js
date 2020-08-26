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
import { userInfoContext } from "../common/context";
import InitPanel from "./bankInfo.set.init";
import BankPanel from "./bankInfo.set.bank";
import AccountPanel from "./bankInfo.set.account";
import ShowCard from "./bankInfo.showCard";

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
		GetCustBankInfo();
	}, []);

	const GetCustBankInfo = () => {
		api_account_GetCustBankInfo().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let datas = res.data.data;
						if (datas !== null) {
							dispatch({
								type: defActionType.GET_CUST_BANK_INFO,
								accountName: datas.accountName,
								custBankList: datas.bankInfoDetail
							});
						} else {
							dispatch({
								type: defActionType.GET_CUST_BANK_INFO,
								accountName: "",
								custBankList: []
							});
						}
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
					reload={GetCustBankInfo}
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

				{userInfo.accountName ? (
					<div className="accountName">
						{t("lbl_BankAccountName")}
						<span>{userInfo.accountName}</span>
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
				reload={GetCustBankInfo}
			/>
		</>
	);
};
