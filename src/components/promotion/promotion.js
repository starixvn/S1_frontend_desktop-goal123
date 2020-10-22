import React, { useEffect, useRef, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../common/context";
import { api_promotion_GetPromotionListV2 } from "../../service/api/promotion";
import { api_account_GetCustSpecificBonus } from "../../service/api/account";
import PromotionList from "./promotion.list";
import PromotionNavBar, { defFilterType } from "./promotion.nav";
import { isExpiry } from "./promotion.common";
import Loading from "../common/loading";

export default () => {
	const { t } = useTranslation();
	const isMountedRef = useRef(null);
	const { userInfo } = useContext(userInfoContext);
	const [filter, setFilter] = useState(defFilterType.all);
	const [initPromoList, setInitPromoList] = useState(null);
	const [promoList, setPromoList] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (userInfo.isLogin !== null) {
			api_promotion_GetPromotionListV2({ langId: userInfo.langId }).then(
				res => {
					if (res.data.errorCode === 0 && isMountedRef.current) {
						let result = res.data.data.sort((a, b) => {
							return a.periodFrom > b.periodFrom ? -1 : 1;
						});

						setInitPromoList(result);
						SetPromotionDatas(result, filter);
						setLoading(false);
					}
				},
				err => {
					if (isMountedRef.current) {
						alert(t("msg_ApiServerError"));
					}
					setLoading(false);
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
		} else if (type === defFilterType.firstDeposit) {
			afterFilterList = _promoList.filter(
				p =>
					(p.promotionType === type || p.promotionType === 5) &&
					!isExpiry({ ...p, isLogin: userInfo.isLogin })
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

	const RefreshProcessBar = ({ bonusCode, tpId, categoryId }) => {
		api_account_GetCustSpecificBonus({
			BonusCode: bonusCode,
			TpId: tpId,
			PromoCategoryId: categoryId
		}).then(
			res => {
				if (
					isMountedRef.current &&
					res.data.errorCode === 0 &&
					res.data.data
				) {
					let idx = initPromoList.findIndex(
						x =>
							x.bonusCode === bonusCode &&
							x.tpId === tpId &&
							x.categoryId === categoryId
					);

					if (idx !== -1) {
						let newPromoList = [...initPromoList];
						newPromoList[idx].custRollOver = res.data.data.rollover;
						newPromoList[idx].custTurnOver = res.data.data.turnover;

						setInitPromoList(newPromoList);
						SetPromotionDatas(newPromoList, filter);
					}
				}
			},
			err => {}
		);
	};

	return loading ? (
		<Loading />
	) : (
		<div className="infoModule">
			<div className="inside-title icon icon-gift">
				<span>{t("lbl_Promotions")}</span>
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
					isLogin={userInfo.isLogin}
					currencyId={userInfo.currencyId}
					filter={filter}
					RefreshProcessBar={RefreshProcessBar}
				/>
			) : null}
		</div>
	);
};
