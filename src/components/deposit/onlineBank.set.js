import React, {
	useEffect,
	useState,
	useContext,
	useRef,
	useReducer
} from "react";
import {
	api_payment_GetOnlinePaymentList,
	api_payment_GetOnlineBankInfoSysList
} from "../../service/api/payment";
import { getUrlParameter, isConvert } from "../common/common";
import { Redirect, Link, useLocation } from "@reach/router";
import { useTranslation } from "react-i18next";
import path from "../../path";
import { userInfoContext } from "../common/context";
import DepositWrapper from "./wrapper";
import BankPanel from "./onlineBank.set.bank";
import AmountPanel from "./onlineBank.set.amount";
import ConfirmPanel from "./onlineBank.set.confirm";
import {
	reducer,
	initState,
	defModule,
	defActionType
} from "./onlineBank.reducer";
import Loading from "../common/loading";

export default () => {
	const { t } = useTranslation();
	const [redirectPath, setRedirectPath] = useState(null);
	const { userInfo } = useContext(userInfoContext);
	const [loading, setLoading] = useState(true);
	const isMountedRef = useRef(null);
	const [state, dispatch] = useReducer(reducer, initState);
	const location = useLocation();

	useEffect(() => {
		console.log();
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		let pId = getUrlParameter("pId");
		let cId = getUrlParameter("cId");
		let name = getUrlParameter("name");
		if (!pId || !cId || !name) {
			setRedirectPath(`/${userInfo.langId}/${path.deposit.root}`);
		}
	}, [setRedirectPath]);

	const getInfoSysList = async pId => {
		await api_payment_GetOnlineBankInfoSysList({
			payId: Number(pId)
		}).then(res => {
			if (res.data.errorCode === 0) {
				let datas = res.data.data.map(b => {
					let { bankLogo, sysId, bankName, ...rest } = b;
					return {
						...rest,
						bankLogo,
						sysId,
						bankName
					};
				});

				if (isMountedRef.current) {
					if (datas.length > 0) {
						dispatch({
							type: defActionType.SET_BANKLIST,
							bankList: datas
						});
					} else {
						setRedirectPath(
							`${userInfo.langId}/${path.deposit.root}`
						);
					}
					setLoading(false);
				}
			}
		});
	};

	useEffect(() => {
		let pId = getUrlParameter("pId");
		let pIdNumber = parseInt(getUrlParameter("pId"));
		if (location.state) {
			if (location.state.selBank) {
				getInfoSysList(pId);
			} else {
				dispatch({
					type: defActionType.SELECT_BANK
				});
			}
			setLoading(false);
		} else if (!location.state) {
			async function getOnlinePaymentList() {
				await api_payment_GetOnlinePaymentList().then(res => {
					if (res.data.errorCode === 0 && isMountedRef.current) {
						if (
							res.data.data.filter(i => i.payId === pIdNumber)[0]
								.selBank
						) {
							getInfoSysList(pId);
						} else {
							dispatch({
								type: defActionType.SELECT_BANK
							});
						}
						setLoading(false);
					}
				});
			}
			getOnlinePaymentList();
		}
	}, [userInfo.langId]);

	const ClickBack = () => {
		dispatch({ type: defActionType.CLICK_BACK });
	};

	let pName = getUrlParameter("name");
	let displayMoudle = null;
	const _isConvert = isConvert(userInfo.currencyId);
	switch (state.displayMoudle) {
		case defModule.BankPanel:
			displayMoudle = (
				<BankPanel dispatch={dispatch} bankList={state.bankList} />
			);
			break;
		case defModule.AmountPanel:
			let maxAmount = getUrlParameter("max");
			let minAmount = getUrlParameter("min");

			displayMoudle = (
				<AmountPanel
					dispatch={dispatch}
					bankInfo={state.bankList[state.bankIdx]}
					_isConvert={_isConvert}
					amount={state.amount}
					maxAmount={maxAmount}
					minAmount={minAmount}
				/>
			);
			break;

		case defModule.ConfirmPanel:
			displayMoudle = (
				<ConfirmPanel
					bankInfo={state.bankList[state.bankIdx]}
					_isConvert={_isConvert}
					amount={state.amount}
				/>
			);
			break;

		default:
			break;
	}

	return loading ? (
		<Loading />
	) : redirectPath === null ? (
		<DepositWrapper step={state.step}>
			<div className="platformName">
				<div className={`icon icon-${pName}`}></div>
				<div>
					<div className="txt-yellow">{t("lbl_OnlineBanking")}</div>
					<div className="txt-red">
						{t("lbl_CreditTime")}:{t("lbl_Instant")}
					</div>
				</div>
				{state.step === 2 ||
				(state.bankList.length < 1 && state.step === 3) ? (
					<Link
						to={`/${userInfo.langId}/${path.deposit.root}`}
						className="icon icon-arrow-left2"></Link>
				) : (
					<a
						onClick={ClickBack}
						className="icon icon-arrow-left2"></a>
				)}
			</div>
			{displayMoudle}
		</DepositWrapper>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
