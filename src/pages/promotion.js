import React, { useEffect, useRef, useContext, useState } from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import LeftMenu from "../components/common/leftMenu";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../components/common/context";
import { api_promotion_GetPromotionListV2 } from "../service/api/promotion";
import moment from "moment";
import { Pagination } from "../components/common/pagination";

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
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
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
	}, []);

	const clickPageNumber = page => {
		if (!processing) {
			setProcessing(true);
			setPagination(prev => ({ ...prev, currentPage: page }));
		}
	};

	let arr = promotionList?.map(item => {
		return (
			<div className="active" key={`promotion-${item.bonusCode}`}>
				<div className="new active"></div>
				<div className="claimed"></div>
				<img src="../img/proImg.jpg" />
				<div className="txt-darkBlue">{item.title}</div>
				<div className="txt-dark">Promotions Details</div>
				<div className="txt-gray">
					<pre>{item.description}</pre>
				</div>
				<div className="rollover">
					<div>
						<div className="icon icon-icon32px_time">
							Remaining Time
						</div>
						<div className="icon icon-icon32px_">Rollover</div>
					</div>
					<div className="txt-orange">
						<div>
							{moment()
								.subtract(item.periodTo, item.preiodFrom)
								.format("DD HH")}
						</div>
						<div>{item.rollOver}</div>
					</div>
				</div>
				<div className="progressBarModule">
					<div className="bounsName">Turnover Accumulated</div>
					<div className="turnover">
						<span>UUS 0</span> / (Req. UUS 2,000)
					</div>
					<div className="progressBar">
						<div className="bar">
							<div
								className="progress"
								// style="width:70%;"
							></div>
						</div>
						<div className="percentage">70%</div>
					</div>
				</div>
				<div className="btnGroup">
					<button className="blue">Details</button>
				</div>
			</div>
		);
	});

	return (
		<div className="infoModule">
			<div className="inside-title icon icon-gift">
				<span>Promotions</span>
			</div>
			<div className="quickSelect">
				<div className="btnGroup promoType">
					<button className="btn-check">All</button>
					<button className="blueBorder">First Deposit Bonus</button>
					<button className="blueBorder">Freebet</button>
				</div>
			</div>
			<div className="proList">{arr}</div>
			<Pagination
				totalPages={pagination.totalPages}
				currentPage={pagination.currentPage}
				clickPageNumber={clickPageNumber}
			/>
		</div>
	);
};
