import React, { useEffect, useState, useRef, useContext } from "react";
import { Link } from "gatsby";
import { api_payment_GetOnlinePaymentList } from "../../service/api/payment";
import LimitTip from "./limitTip";
import { isConvert } from "../common/common";
import { userInfoContext } from "../common/context";
import path from "../../path";
import { useTranslation } from "react-i18next";
import Loading from "../common/loading";
import config from "../../config";

const _path = path.deposit.sub.onlineBank.root;

export default () => {
	const { t } = useTranslation();
	const [onlineBankingList, setOnlineBankingList] = useState([]);
	const [loading, setLoading] = useState(true);
	const { userInfo } = useContext(userInfoContext);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_payment_GetOnlinePaymentList().then(res => {
			if (res.data.errorCode === 0 && isMountedRef.current) {
				setOnlineBankingList(res.data.data);
				setLoading(false);
			}
		});
	}, []);

	const _isConvert = isConvert(userInfo.currencyId);
	let rows = onlineBankingList?.map(p => {
		return (
			<li key={`deposit-onlineBank-${p.payId}-${p.channelId}`}>
				<Link
					state={{ selBank: p.selBank }}
					to={`${_path}?name=${p.payName}&pId=${p.payId}&cId=${p.channelId}&max=${p.maxAmount}&min=${p.minAmount}`}>
					<img
						src={`${config.imgUrl}/common/images/Payment/${p.payName}.png`}
						alt={p.payName}></img>
				</Link>
				<LimitTip
					minAmount={p.minAmount}
					maxAmount={p.maxAmount}
					displayTextLimit={t("lbl_Limit")}
					displayTextUnLimit={t("lbl_Unlimited")}
					_isConvert={_isConvert}
				/>
			</li>
		);
	});

	return loading ? (
		<Loading />
	) : onlineBankingList !== null && onlineBankingList.length > 0 ? (
		<div className="subModule">
			<div className="subModuleTitle">
				<div>
					<span>{t("lbl_DepositType1")}</span>
					<span>
						{t("lbl_CreditTime")}: {t("lbl_Instant")}
					</span>
				</div>
			</div>
			<div className="subModuleBody">
				<ul>{rows}</ul>
			</div>
		</div>
	) : (
		<></>
	);
};
