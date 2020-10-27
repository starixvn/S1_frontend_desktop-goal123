import React, { useEffect, useRef, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
	userInfoContext,
	popBoxContext
} from "../../components/common/context";
import {
	getUrlParameter,
	isConvert,
	number_format
} from "../../components/common/common";
import { api_promotion_GetPromotionDetail } from "../../service/api/promotion";
import { api_account_GetCustSpecificBonus } from "../../service/api/account";
import { defPopBoxType } from "../common/popBox";
import ProcessBar from "./promotion.processBar";
import { isExpiry, isClaimed } from "./promotion.common";
import moment from "moment";
import { promoStatus } from "./promotion.def";
import Loading from "../common/loading";
import PromotionJoinButton from "./promotion.joinButton";

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [promotionInfo, setPromotionInfo] = useState(null);
	const isMountedRef = useRef(null);
	const [loading, setLoading] = useState(true);

	let _currency = t(`Currency_${userInfo.currencyId}`);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (userInfo.isLogin !== null) {
			let _bonusCode = getUrlParameter("bonusCode");
			getPromotionDetail(userInfo.langId, _bonusCode);
		}
	}, [userInfo.isLogin, userInfo.langId]);

	const clickClose = () => {
		setPopBox({ isOpen: false });
	};

	const openErrorMessagePopBox = (
		message = t("msg_ApiServerError"),
		errorCode = null
	) => {
		setPopBox({
			message,
			errorCode,
			isOpen: true,
			popBoxType: defPopBoxType.ErrorMsg,
			icon: "icon-bell",
			btnBar: (
				<div className="btnGroup">
					<button className="btn-cancel" onClick={clickClose}>
						{t("lbl_Close")}
					</button>
				</div>
			)
		});
	};

	const getPromotionDetail = async (langId, _bonusCode) => {
		await api_promotion_GetPromotionDetail({
			langId,
			BonusCode: _bonusCode
		}).then(
			({ data: { data, message, errorCode } }) => {
				if (!isMountedRef.current) return;
				const success = errorCode === 0;
				setLoading(false);
				if (success) {
					return setPromotionInfo(data);
				} else {
					openErrorMessagePopBox(message || "error", errorCode);
				}
			},
			err => {
				if (isMountedRef.current) {
					openErrorMessagePopBox();
					setLoading(false);
				}
			}
		);
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

	return loading ? (
		<Loading />
	) : (
		<>
			{promotionInfo === null ? (
				<></>
			) : (
				<div className="infoModule">
					<div className={`promotionsInfo${wrapperClass}`}>
						{_isClaimed ? <div className="claimed"></div> : null}
						<img
							src={promotionInfo.banner}
							alt={promotionInfo.description}
						/>
						<div className="proData">
							<div className="proDataTitle">
								<div className="txt-blue2">
									{promotionInfo.title}
									<div className="txt-blue2">
										{promotionInfo.description}
									</div>
								</div>

								<div className="btnGroup">
									<PromotionJoinButton
										promotionInfo={promotionInfo}
										userInfo={userInfo}
										_isExpiry={_isExpiry}
										callBack={() =>
											getPromotionDetail(
												userInfo.langId,
												promotionInfo.bonusCode
											)
										}
									/>
								</div>
							</div>

							<DepositMenu
								cash={number_format(
									promotionInfo.depositAmount,
									isConvert(userInfo.currencyId)
								)}
								_currency={_currency}
								promotionInfo={promotionInfo}
								t={t}
							/>

							<ProcessBar
								t={t}
								_isConvert={_isConvert}
								currencyId={userInfo.currencyId}
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
							<Rollover promotionInfo={promotionInfo} t={t} />
							<div
								className="proDataBody"
								dangerouslySetInnerHTML={{
									__html: `${promotionInfo.details}`
								}}></div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

const Rollover = ({ promotionInfo, t }) => {
	const {
		isJoin,
		status,
		custExpiryTime,
		periodTo,
		requiredAmount,
		rollOver
	} = promotionInfo;

	let expiryTime = moment.duration(
		moment
			.unix(
				isJoin && status === promoStatus.running && custExpiryTime
					? moment(custExpiryTime).unix()
					: periodTo
			)
			.diff(new Date())
	);

	let displayExpiryTime =
		expiryTime.days() +
		" " +
		t("lbl_Days") +
		" " +
		expiryTime.hours() +
		" " +
		t("lbl_Hours");
	return (
		<div className="rollover">
			<div>
				{requiredAmount > 0 ? (
					<div className="icon icon-icon32px_money">
						{t("lbl_MinAmount")}
					</div>
				) : null}
				<div className="icon icon-icon32px_time">
					{t("lbl_RemainingTime")}
				</div>
				<div className="icon icon-icon32px_">{t("lbl_RollOver")}</div>
			</div>

			<div className="txt-orange">
				{requiredAmount > 0 ? (
					<div>{number_format(requiredAmount, true)}</div>
				) : null}
				<div>{displayExpiryTime}</div>
				<div>{rollOver ? rollOver : 1}X</div>
			</div>
		</div>
	);
};

const DepositMenu = ({
	cash,
	_currency,
	promotionInfo: { promotionType, canJoin, isJoin, depositId },
	t
}) => {
	if (
		depositId &&
		canJoin &&
		!isJoin &&
		(promotionType === 1 || promotionType === 2)
	)
		return (
			<div className="minAmount">
				<div>
					<div>{t("lbl_ID")}</div>
					<div>{depositId}</div>
				</div>
				<div>
					<div>{t("lbl_DepositAmount")}</div>
					<div>{`${_currency} ${cash}`}</div>
				</div>
			</div>
		);

	return null;
};
