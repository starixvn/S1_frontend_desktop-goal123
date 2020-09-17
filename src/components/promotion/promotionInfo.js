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
import { Link } from "@reach/router";
import path from "../../path";

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
			GetPromotionDetail(userInfo.langId, _bonusCode);
		}
	}, [userInfo.isLogin, userInfo.langId]);

	const GetPromotionDetail = (langId, _bonusCode) => {
		api_promotion_GetPromotionDetail({
			langId: langId,
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
	};

	const onJoinPromotion = _promo => {
		if (userInfo.isLogin === false) {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.Login
			});
		} else {
			const ClosePopBox = () => {
				setPopBox({
					isOpen: false
				});
			};

			if (
				userInfo.currencyId &&
				userInfo.accountName &&
				userInfo.phoneNo &&
				userInfo.email
			) {
				api_promotion_SetClaimPromotion({
					langId: userInfo.langId,
					BonusCode: _promo.bonusCode
				}).then(
					res => {
						if (isMountedRef.current && res.data.errorCode === 0) {
							GetPromotionDetail(
								userInfo.langId,
								_promo.bonusCode
							);

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
						} else {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.ErrorMsg,
								message: res.data.message
									? res.data.message
									: `[${res.data.errorCode}] Something went wrong...`,
								btnBar: (
									<div className="btnGroup">
										<button
											className="btn-cancel"
											onClick={ClosePopBox}>
											{t("lbl_Close")}
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
			} else {
				setPopBox({
					isOpen: true,
					popBoxType: defPopBoxType.UpdateProfile,
					title: t("lbl_ImportantNote"),
					content: t("lbl_UpdatePersonalInfoPromotion"),
					btnBar: (
						<div className="btnGroup">
							<Link
								className="btn-check"
								to={`/${userInfo.langId}/${path.profile.root}?prevPage=${path.promotion.root}&BonusCode=${_promo.bonusCode}`}>
								{t("lbl_UpdatePersonalDetail")}
							</Link>
						</div>
					)
				});
				// if (!userInfo.phoneVerified) {
				// 	setPopBox({
				// 		isOpen: true,
				// 		popBoxType: defPopBoxType.OTPHint,
				// 		btnBar: (
				// 			<div className="btnGroup">
				// 				<button
				// 					className="btn-cancel"
				// 					onClick={ClosePopBox}>
				// 					{t("lbl_Cancel")}
				// 				</button>
				// 				<Link
				// 					to={`/${userInfo.langId}/${path.profile.root}`}
				// 					className="btn-check">
				// 					{t("lbl_GoNow")}
				// 				</Link>
				// 			</div>
				// 		)
				// 	});
				// }
			}
		}
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
				<img src={promotionInfo.banner} alt="promotionInfo_banner" />
				<div className="proData">
					<div className="proDataTitle">
						<div className="txt-blue2">
							{promotionInfo.title}
							<div className="txt-blue2">
								{promotionInfo.description}
							</div>
						</div>
						{(promotionInfo.canJoin &&
							promotionInfo.status === 0) ||
						(userInfo.isLogin === false && !_isExpiry) ? (
							<div className="btnGroup">
								<button
									className="btn-check"
									onClick={onJoinPromotion.bind(
										this,
										promotionInfo
									)}>
									{t("lbl_PromoJoinNow")}
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
							__html: `${promotionInfo.details}`
						}}></div>
				</div>
			</div>
		</div>
	);
};
