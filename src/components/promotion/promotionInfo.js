import React, { useEffect, useRef, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
	userInfoContext,
	popBoxContext
} from "../../components/common/context";
import { getUrlParameter, isConvert } from "../../components/common/common";
import {
	api_promotion_GetPromotionDetail,
	api_promotion_SetClaimPromotion
} from "../../service/api/promotion";
import { api_account_GetCustSpecificBonus } from "../../service/api/account";
import { defPopBoxType } from "../common/popBox";
import ProcessBar from "./promotion.processBar";
import { isExpiry, isClaimed } from "./promotion.common";

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [promotionInfo, setPromotionInfo] = useState(null);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (userInfo.isLogin !== null) {
			let _bonusCode = getUrlParameter("bonusCode");
			api_promotion_GetPromotionDetail({
				langId: userInfo.langId,
				BonusCode: _bonusCode
			}).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setPromotionInfo(res.data.data);
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
		}
	}, [userInfo.isLogin, userInfo.langId]);

	const onJoinPromotion = () => {
		if (userInfo.isLogin === false) {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.Login
			});
		} else {
			let _bonusCode = getUrlParameter("bonusCode");
			api_promotion_SetClaimPromotion({
				langId: userInfo.langId,
				BonusCode: _bonusCode
			}).then(
				res => {
					if (isMountedRef.current && res.data.errorCode === 0) {
						const ClosePopBox = () => {
							setPopBox({
								isOpen: false
							});
						};

						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.Success,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-check"
										onClick={ClosePopBox}>
										OK
									</button>
								</div>
							)
						});
					}
				},
				err => {
					alert(t("msg_ApiServerError"));
				}
			);
		}
	};

	const RefreshProcessBar = ({ bonusCode, tpId, categoryId }) => {
		api_account_GetCustSpecificBonus({
			BonusCode: bonusCode,
			TpId: tpId,
			PromoCategoryId: categoryId
		}).then(
			res => {
				if (isMountedRef.current && res.data.errorCode === 0) {
					setPromotionInfo(prevS => ({
						...prevS,
						custRollOver: res.data.data.rollover,
						custTurnOver: res.data.data.turnover
					}));
				}
			},
			err => {}
		);
	};

	let _isClaimed = false;
	let _isExpiry = false;

	if (promotionInfo !== null) {
		_isClaimed = isClaimed(promotionInfo);
		_isExpiry = isExpiry({ ...promotionInfo, isLogin: userInfo.isLogin });
	}

	let wrapperClass = _isClaimed
		? _isExpiry
			? " expiredClaimedInfo"
			: " claimedInfo"
		: _isExpiry
		? " expiredClaimedInfo"
		: "";

	let _isConvert = isConvert(userInfo.currencyId);

	return promotionInfo === null ? (
		<></>
	) : (
		<div className="infoModule">
			<div className={`promotionsInfo${wrapperClass}`}>
				{_isClaimed ? <div className="claimed"></div> : null}
				<img src={promotionInfo.banner} />
				<div className="proData">
					<div className="proDataTitle">
						<div className="txt-darkBlue">
							{promotionInfo.title}
							<div className="txt-darkBlue">
								{promotionInfo.description}
							</div>
						</div>
						{(promotionInfo.canJoin &&
							promotionInfo.status === 0) ||
						(userInfo.isLogin === false && !_isExpiry) ? (
							<div className="btnGroup">
								<button
									className="btn-check"
									onClick={onJoinPromotion}>
									{t("lbl_JoinNow")}
								</button>
							</div>
						) : null}
					</div>
					<ProcessBar
						t={t}
						_isConvert={_isConvert}
						currency={userInfo.currencyId}
						{...promotionInfo}
						RefreshProcessBar={RefreshProcessBar.bind(
							this,
							promotionInfo
						)}
						hideReloadBtn={isExpiry({
							...promotionInfo,
							isLogin: userInfo.isLogin
						})}
					/>
					<div
						className="proDataBody"
						dangerouslySetInnerHTML={{
							__html: `<pre>${promotionInfo.details}</pre>`
						}}></div>
				</div>
			</div>
		</div>
	);
};
