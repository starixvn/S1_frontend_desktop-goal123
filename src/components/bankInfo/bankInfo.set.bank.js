import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { defActionType } from "./bankInfo.reducer";
import { api_payment_GetBankInfoSysList } from "../../service/api/payment";
import config from "../../config";

export default ({ dispatch, bankList }) => {
	const { t } = useTranslation();
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_payment_GetBankInfoSysList().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						dispatch({
							type: defActionType.SET_BANKLIST,
							bankList: res.data.data
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

	const toLastStep = () => {
		dispatch({ type: defActionType.TO_LAST_STEP });
	};

	const selectBank = bankIdx => {
		dispatch({ type: defActionType.SELECT_BANK, bankIdx });
	};

	let arr = bankList?.map((item, i) => {
		return (
			<li key={`addBankAccount-${item.sysId}`}>
				<a onClick={selectBank.bind(this, i)}>
					<img
						src={`${config.imgUrl}/common/images/BankLogo/${item.bankLogo}`}
						alt={item.bankName}
					/>
				</a>
			</li>
		);
	});

	return (
		<>
			<div className="platformName">
				<div className="icon icon-arrow-right2"></div>
				<div>
					<div className="txt-blue2">{t("lbl_SelectBank")}</div>
				</div>
				<button
					className="icon icon-arrow-left2"
					onClick={toLastStep}></button>
			</div>
			<div className="subModuleList">
				<div className="subModule">
					<div className="subModuleBody">
						<ul>{arr}</ul>
					</div>
				</div>
			</div>
		</>
	);
};
