import React, {
	useEffect,
	useReducer,
	useRef,
	useContext,
	useState
} from "react";
import { api_payment_GetBankInfoOffList } from "../../service/api/payment";
import { Redirect, Link } from "@reach/router";
import { isConvert } from "../common/common";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../common/context";
import DepositWrapper from "./wrapper";
import BankPanel from "./localBank.set.bank";
import AmountPanel from "./localBank.set.amount";
import ConfirmPanel from "./localBank.set.confirm";
import path from "../../path";
import {
	reducer,
	initState,
	defModule,
	defActionType
} from "./localBank.reducer";
import Loading from "../common/loading";
import { defPopBoxType } from "../common/popBox";

export default () => {
	const { t } = useTranslation();
	const [redirectPath, setRedirectPath] = useState(null);
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [state, dispatch] = useReducer(reducer, initState);
	const [loading, setLoading] = useState(true);
	const _isConvert = isConvert(userInfo.currencyId);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_payment_GetBankInfoOffList().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let datas = res.data.data;
						if (datas.length > 0) {
							dispatch({
								type: defActionType.SET_BANKLIST,
								bankList: datas
							});
						} else {
							setRedirectPath(
								`/${userInfo.langId}/${path.deposit.root}`
							);
						}
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
	}, []);

	useEffect(() => {
		if (userInfo.isLogin === true) {
			if (
				(!userInfo.accountName && userInfo.accountName !== undefined) ||
				(!userInfo.phoneNo && userInfo.phoneNo !== undefined) ||
				(!userInfo.email && userInfo.email !== undefined)
			) {
				const clickClose = () => {
					setPopBox({ isOpen: false });
				};
				setPopBox({
					isOpen: true,
					popBoxType: defPopBoxType.UpdateProfile,
					title: t("lbl_ImportantNote"),
					content: t("lbl_UpdatePersonalInfoDeposit"),
					btnBar: (
						<div className="btnGroup">
							{/* <button className="btn-cancel" onClick={clickClose}>
								{t("lbl_Cancel")}
							</button> */}
							<button className="btn-check" onClick={toProfile}>
								{t("lbl_UpdatePersonalDetail")}
							</button>
						</div>
					)
				});
			}
		}
	}, [userInfo]);

	const toProfile = () => {
		setRedirectPath(`/${userInfo.langId}/${path.profile.root}`);
	};

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	let displayModule = null;
	switch (state.displayModule) {
		case defModule.BankPanel:
			displayModule = (
				<BankPanel dispatch={dispatch} bankList={state.bankList} />
			);
			break;

		case defModule.AmountPanel:
			displayModule = (
				<AmountPanel
					bankInfo={state.bankList[state.bankIdx]}
					_isConvert={_isConvert}
					amount={state.amount}
					dispatch={dispatch}
				/>
			);
			break;

		case defModule.ConfirmPanel:
			displayModule = (
				<ConfirmPanel
					bankInfo={state.bankList[state.bankIdx]}
					_isConvert={_isConvert}
					amount={state.amount}
					dispatch={dispatch}
				/>
			);
			break;

		default:
			break;
	}

	const ClickBack = () => {
		dispatch({ type: defActionType.CLICK_BACK });
	};

	return loading ? (
		<Loading />
	) : redirectPath === null ? (
		<DepositWrapper step={state.step}>
			<div className="platformName">
				<div className="icon icon-library"></div>
				<div>
					<div className="txt-yellow">{t("lbl_WireTransfers")}</div>
					<div className="txt-red">
						{t("lbl_CreditTime")}: {t("lbl_5mins")}
					</div>
				</div>
				{state.step === 2 ? (
					<Link
						to={`/${userInfo.langId}/${path.deposit.root}`}
						className="icon icon-arrow-left2"></Link>
				) : (
					<a
						className="icon icon-arrow-left2"
						onClick={ClickBack}></a>
				)}
			</div>
			{displayModule}
		</DepositWrapper>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
