import React, { useEffect, useRef, useState, useContext } from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import LeftMenu from "../components/common/leftMenu";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../components/common/context";
import { getUrlParameter } from "../components/common/common";
import { api_promotion_GetPromotionDetail } from "../service/api/promotion";
import { Redirect } from "@reach/router";
import path from "../path";

export default () => {
	return (
		<Wrapper>
			<Layout>
				<main>
					<section className="inside">
						<LeftMenu />
						<div className="rightModule">
							<Content />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};

const Content = () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const [redirectPath, setRedirectPath] = useState(null);
	const [promotionInfo, setPromotionInfo] = useState({});
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		openPromotion();
	}, []);

	const openPromotion = () => {
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
	};

	let percentage =
		promotionInfo.custTurnOver > promotionInfo.custRollOver
			? 100
			: Math.round(
					(promotionInfo.custTurnOver / promotionInfo.custRollOver) *
						100,
					2
			  );
	percentage = percentage || 0;

	return (
		<div className="infoModule">
			<div className="promotionsInfo">
				<img src={promotionInfo.banner} />
				<div className="proData">
					<div className="proDataTitle">
						<div className="txt-darkBlue">
							{promotionInfo.title}
							<div className="txt-darkBlue">
								{promotionInfo.description}
							</div>
						</div>
						{promotionInfo.canJoin ? (
							<div className="btnGroup">
								<button className="btn-check">
									{t("lbl_JoinNow")}
								</button>
							</div>
						) : null}
					</div>
					{promotionInfo.isJoin ? (
						<div className="progressBarModule">
							<div className="bounsName">
								{t("lbl_TurnoverAccumulated")}
							</div>
							<div className="turnover">
								<span>
									{t(`Currency_${userInfo.currencyId}`)}{" "}
									{promotionInfo.custTurnOver}
								</span>{" "}
								/ ({t("lbl_Req")}{" "}
								{t(`Currency_${userInfo.currencyId}`)}{" "}
								{promotionInfo.custRollOver})
							</div>
							<div className="progressBar">
								<div className="bar">
									<div
										className="progress"
										style={{
											width: `${percentage}%`
										}}></div>
								</div>
								<div className="percentage">{`${percentage}%`}</div>
							</div>
						</div>
					) : null}
					<div className="proDataBody">
						<pre>{promotionInfo.details}</pre>
					</div>
				</div>
			</div>
		</div>
	);
};
