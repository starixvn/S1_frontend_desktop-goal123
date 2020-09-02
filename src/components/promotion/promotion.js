import React, { useEffect, useRef, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../common/context";
import { api_promotion_GetPromotionListV2 } from "../../service/api/promotion";
import moment from "moment";
import PromotionList from "./promotion.list";
import PromotionNavBar, { defFilterType } from "./promotion.nav";
import { isExpiry } from "./promotion.common";

export default () => {
	const { t } = useTranslation();
	const isMountedRef = useRef(null);
	const { userInfo } = useContext(userInfoContext);
	const [filter, setFilter] = useState(defFilterType.all);
	const [initPromoList, setInitPromoList] = useState(null);
	const [promoList, setPromoList] = useState([]);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (userInfo.isLogin !== null) {
			api_promotion_GetPromotionListV2({ langId: userInfo.langId }).then(
				res => {
					if (res.data.errorCode === 0 && isMountedRef.current) {
						setInitPromoList(
							res.data.data.sort((a, b) => {
								return a.periodFrom > b.periodFrom ? -1 : 1;
							})
						);
						SetPromotionDatas(res.data.data, filter);
					}
				},
				err => {
					if (isMountedRef.current) {
						alert(t("msg_ApiServerError"));
					}
				}
			);
		}
	}, [userInfo.isLogin, userInfo.langId]);

	const SetPromotionDatas = (_promoList, type) => {
		let afterFilterList = [];
		if (type === defFilterType.all) {
			afterFilterList = _promoList.filter(
				p => !isExpiry({ ...p, isLogin: userInfo.isLogin })
			);
		} else if (type === defFilterType.expiry) {
			afterFilterList = _promoList.filter(p =>
				isExpiry({ ...p, isLogin: userInfo.isLogin })
			);
		} else {
			afterFilterList = _promoList.filter(
				p =>
					p.promotionType === type &&
					!isExpiry({ ...p, isLogin: userInfo.isLogin })
			);
		}

		setPromoList(afterFilterList);
	};

	const SelectPromotionType = type => {
		if (initPromoList) {
			SetPromotionDatas(initPromoList, type);
		}

		setFilter(type);
	};

	return (
		<div className="infoModule">
			<div className="inside-title icon icon-gift">
				<span>{t("lbl_PromotionsList")}</span>
			</div>
			<PromotionNavBar
				t={t}
				onClick={SelectPromotionType}
				selected={filter}
			/>
			{userInfo.isLogin !== null ? (
				<PromotionList
					promoList={promoList}
					t={t}
					langId={userInfo.langId}
					currency={userInfo.currency}
					filter={filter}
				/>
			) : null}
		</div>
	);
};
