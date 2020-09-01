import React, { useEffect, useRef, useContext, useState } from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import LeftMenu from "../components/common/leftMenu";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../components/common/context";
import {
	api_promotion_GetPromotionListV2,
	api_promotion_GetCustSpecificBonus
} from "../service/api/promotion";
import { Pagination } from "../components/common/pagination";
import { Redirect } from "@reach/router";
import moment from "moment";
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

const initPagination = {
	totalPages: 0,
	currentPage: 1
};

const Content = () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const [promotionList, setPromotionList] = useState([]);
	const [processing, setProcessing] = useState(false);
	const [pagination, setPagination] = useState(initPagination);
	const [tab, setTab] = useState({ promotionType: 0, status: 0 });
	const [redirectPath, setRedirectPath] = useState(null);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (userInfo.isLogin !== null) {
			api_promotion_GetPromotionListV2({ langId: userInfo.langId }).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setPromotionList(res.data.data);
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
	}, [userInfo.isLogin]);

	const switchTab = col => {
		let _promotionType = 0;
		let _status = 0;

		if (col === "firstDeposit") {
			_promotionType = 1;
		} else if (col === "freeBet") {
			_promotionType = 3;
		} else if (col === "expired") {
			_status = 2;
			_promotionType = null;
		}
		setTab({
			promotionType: _promotionType,
			status: _status
		});
	};

	const clickDetail = bonusCode => {
		setRedirectPath(
			`/${userInfo.langId}/${path.promotionInfo.root}?bonusCode=${bonusCode}`
		);
	};

	const GetCustSpecificBonus = () => {
		if (!processing) {
			setProcessing(true);
			//api
		}
	};

	const clickPageNumber = page => {
		if (!processing) {
			setProcessing(true);
			setPagination(prev => ({ ...prev, currentPage: page }));
		}
	};

	let arr = promotionList?.map(item => {
		let percentage =
			item.custTurnOver > item.custRollOver
				? 100
				: Math.round((item.custTurnOver / item.custRollOver) * 100, 2);
		percentage = percentage || 0;

		let remainDiff = moment.duration(
			moment.unix(item.periodTo).diff(new Date())
		);
		let remaining =
			remainDiff.seconds() > 0
				? `${
						remainDiff.months() * 30 + remainDiff.days()
				  } days ${remainDiff.hours()} hours`
				: `expired`;

		let newDiff = moment.duration(
			moment.unix(item.periodFrom).diff(new Date())
		);
		let newIcon = newDiff.days() > -14;

		return (item.status !== 0 && tab.status === item.status) ||
			(item.status !== 2 && tab.promotionType === item.promotionType) ||
			(item.status !== 2 && tab.promotionType === 0) ? (
			<div key={`promotion-${item.bonusCode}`}>
				{/* className="active" */}
				{/* <div className="claimed"></div> */}
				{newIcon ? <div className="new active"></div> : null}

				<img src={item.banner} />
				<div className="txt-darkBlue">{item.title}</div>
				<div className="txt-dark">{t("lbl_PromotionDescription")}</div>
				<div className="txt-gray">
					<pre>{item.description}</pre>
				</div>
				<div className="rollover">
					<div>
						<div className="icon icon-icon32px_time">
							{t("lbl_RemainingTime")}
						</div>
						<div className="icon icon-icon32px_">
							{t("lbl_RollOver")}
						</div>
					</div>
					<div className="txt-orange">
						<div>
							{!item.custExpiryTime
								? remaining
								: item.custExpiryTime}
						</div>
						<div>{item.rollOver}</div>
					</div>
				</div>

				{userInfo.isLogin && item.isJoin ? (
					<div className="progressBarModule">
						<div className="bounsName">
							{t("lbl_TurnoverAccumulated")}
						</div>
						<div className="turnover">
							<span>
								{t(`Currency_${userInfo.currencyId}`)}{" "}
								{item.custTurnOver}
							</span>{" "}
							/ ({t("lbl_Req")}{" "}
							{t(`Currency_${userInfo.currencyId}`)}{" "}
							{item.custRollOver})
							<button class="icon icon-spinner11"></button>
						</div>
						<div className="progressBar">
							<div className="bar">
								<div
									className="progress"
									style={{ width: `${percentage}%` }}></div>
							</div>
							<div className="percentage">{`${percentage}%`}</div>
						</div>
					</div>
				) : null}

				<div className="btnGroup">
					<button
						className="blue"
						onClick={clickDetail.bind(this, item.bonusCode)}>
						{t("lbl_Details")}
					</button>
				</div>
			</div>
		) : null;
	});

	return redirectPath === null ? (
		<div className="infoModule">
			<div className="inside-title icon icon-gift">
				<span>{t("lbl_PromotionsList")}</span>
			</div>
			<div className="quickSelect">
				<div className="btnGroup promoType">
					<button
						className={`blueBorder${
							tab.promotionType === 0 ? " btn-check" : ""
						}`}
						onClick={switchTab.bind(this, "all")}>
						{t("lbl_All")}
					</button>
					<button
						className={`blueBorder${
							tab.promotionType === 1 ? " btn-check" : ""
						}`}
						onClick={switchTab.bind(this, "firstDeposit")}>
						{t("PromotionCategory1")}
					</button>
					<button
						className={`blueBorder${
							tab.promotionType === 3 ? " btn-check" : ""
						}`}
						onClick={switchTab.bind(this, "freeBet")}>
						{t("lbl_Freebet")}
					</button>
					<button
						className="orange"
						onClick={switchTab.bind(this, "expired")}>
						{t("lbl_Expried")}
					</button>
				</div>
			</div>
			<div className="proList">{arr}</div>

			{pagination.totalPages !== 0 ? (
				<Pagination
					totalPages={pagination.totalPages}
					currentPage={pagination.currentPage}
					clickPageNumber={clickPageNumber}
				/>
			) : null}
		</div>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
