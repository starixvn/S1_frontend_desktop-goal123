import React from "react";
import { Link } from "@reach/router";
import path from "../../path";
import ProcessBar from "./promotion.processBar";
import { defFilterType } from "./promotion.nav";
import { isNew, isClaimed, isExpiry } from "./promotion.common";
import PromotionJoinButton from "./promotion.joinButton";
import PromoRule from "./promotion.promoRule";

export default ({
	t,
	filter,
	userInfo,
	promoList,
	RefreshProcessBar,
	getPromotionListV2
}) => {
	const { langId, isLogin, currencyId } = userInfo;

	let rows = promoList?.map(p => {
		let _isClaimed = isClaimed(p);
		let _isNew = _isClaimed ? false : isNew(p);
		let _isExpiry = isExpiry({ ...p, isLogin });

		return (
			<div
				key={`promotion.list-${p.bonusCode}-${p.categoryId}-${p.tpId}`}
				className={_isClaimed ? "active" : ""}>
				{_isClaimed ? <div className="claimed"></div> : null}
				{filter === defFilterType.expiry ? (
					<div className="expiredIcon">EXPIRED</div>
				) : (
					<div className={_isNew ? "new" : ""}></div>
				)}
				<img src={p.banner} alt={p.title} />
				<div className="txt-darkBlue">{p.title}</div>
				<div className="txt-dark">{t("lbl_PromotionsDesc")}</div>
				<div className="txt-gray">{p.description}</div>
				<PromoRule t={t} promotionInfo={p} />
				<ProcessBar
					{...p}
					t={t}
					currencyId={currencyId}
					RefreshProcessBar={RefreshProcessBar.bind(this, p)}
					hideReloadBtn={_isExpiry}
				/>
				<div className="btnGroup">
					<Link
						type="button"
						className="blue"
						to={`/${langId}/${path.promotion.root}/${path.promotion.sub.promotionInfo.root}?BonusCode=${p.bonusCode}`}>
						{t("lbl_Details")}
					</Link>

					<PromotionJoinButton
						promotionInfo={p}
						userInfo={userInfo}
						_isExpiry={_isExpiry}
						callBack={getPromotionListV2}
					/>
				</div>
			</div>
		);
	});

	if (isLogin === null) return null;

	return rows && rows.length > 0 ? (
		<div
			className={`proList${
				filter === defFilterType.expiry ? " expired" : ""
			}`}>
			{rows}
		</div>
	) : (
		<div className="nodata">{t("msg_NoData")}</div>
	);
};
