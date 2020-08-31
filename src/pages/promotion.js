import React, { useEffect, useRef, useContext, useState } from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import LeftMenu from "../components/common/leftMenu";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../components/common/context";
import { api_promotion_GetPromotionListV2 } from "../service/api/promotion";

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
	const [promotionList, setPromotionList] = useState([]);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_promotion_GetPromotionListV2(userInfo.langId).then(
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

	let arr = promotionList?.map(item => {
		console.log(item);
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
			<div className="proList">
				<div className="active">
					{/* <div className="new active"></div> */}
					<div className="claimed"></div>
					<img src="../img/proImg.jpg" />
					<div className="txt-darkBlue">
						New User 50% 1St Deposit Bonus
					</div>
					<div className="txt-dark">Promotions Details</div>
					<div className="txt-gray">
						<ul>
							<li>
								Only applicable for New user with FIRST success
								deposit.
							</li>
							<li>FIRST deposit amount x50% = Bonus amount.</li>
						</ul>
					</div>
					<div className="rollover">
						<div>
							<div className="icon icon-icon32px_time">
								Remaining Time
							</div>
							<div className="icon icon-icon32px_">Rollover</div>
						</div>
						<div className="txt-orange">
							<div>54 days 18 hours</div>
							<div>2X</div>
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
				<div>
					{/* <div className="new"></div> */}
					{/* <div className="claimed"></div> */}
					<img src="../img/proImg.jpg" />
					<div className="txt-darkBlue">
						New User 50% 1St Deposit Bonus
					</div>
					<div className="txt-dark">Promotions Details</div>
					<div className="txt-gray">
						<ul>
							<li>
								Only applicable for New user with FIRST success
								deposit.
							</li>
							<li>FIRST deposit amount x50% = Bonus amount.</li>
						</ul>
					</div>
					<div className="rollover">
						<div>
							<div className="icon icon-icon32px_time">
								Remaining Time
							</div>
							<div className="icon icon-icon32px_">Rollover</div>
						</div>
						<div className="txt-orange">
							<div>54 days 18 hours</div>
							<div>2X</div>
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
				<div>
					<img src="../img/proImg.jpg" />
					<div className="txt-darkBlue">
						New User 50% 1St Deposit Bonus
					</div>
					<div className="txt-dark">Promotions Details</div>
					<div className="txt-gray">
						<ul>
							<li>
								Only applicable for New user with FIRST success
								deposit.
							</li>
							<li>FIRST deposit amount x50% = Bonus amount.</li>
						</ul>
					</div>
					<div className="rollover">
						<div>
							<div className="icon icon-icon32px_time">
								Remaining Time
							</div>
							<div className="icon icon-icon32px_">Rollover</div>
						</div>
						<div className="txt-orange">
							<div>54 days 18 hours</div>
							<div>2X</div>
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
				<div>
					<img src="../img/proImg.jpg" />
					<div className="txt-darkBlue">
						New User 50% 1St Deposit Bonus
					</div>
					<div className="txt-dark">Promotions Details</div>
					<div className="txt-gray">
						<ul>
							<li>
								Only applicable for New user with FIRST success
								deposit.
							</li>
							<li>FIRST deposit amount x50% = Bonus amount.</li>
						</ul>
					</div>
					<div className="rollover">
						<div>
							<div className="icon icon-icon32px_time">
								Remaining Time
							</div>
							<div className="icon icon-icon32px_">Rollover</div>
						</div>
						<div className="txt-orange">
							<div>54 days 18 hours</div>
							<div>2X</div>
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
				<div>
					<img src="../img/proImg.jpg" />
					<div className="txt-darkBlue">
						New User 50% 1St Deposit Bonus
					</div>
					<div className="txt-dark">Promotions Details</div>
					<div className="txt-gray">
						<ul>
							<li>
								Only applicable for New user with FIRST success
								deposit.
							</li>
							<li>FIRST deposit amount x50% = Bonus amount.</li>
						</ul>
					</div>
					<div className="rollover">
						<div>
							<div className="icon icon-icon32px_time">
								Remaining Time
							</div>
							<div className="icon icon-icon32px_">Rollover</div>
						</div>
						<div className="txt-orange">
							<div>54 days 18 hours</div>
							<div>2X</div>
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
				<div>
					<img src="../img/proImg.jpg" />
					<div className="txt-darkBlue">
						New User 50% 1St Deposit Bonus
					</div>
					<div className="txt-dark">Promotions Details</div>
					<div className="txt-gray">
						<ul>
							<li>
								Only applicable for New user with FIRST success
								deposit.
							</li>
							<li>FIRST deposit amount x50% = Bonus amount.</li>
						</ul>
					</div>
					<div className="rollover">
						<div>
							<div className="icon icon-icon32px_time">
								Remaining Time
							</div>
							<div className="icon icon-icon32px_">Rollover</div>
						</div>
						<div className="txt-orange">
							<div>54 days 18 hours</div>
							<div>2X</div>
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
				<div>
					<img src="../img/proImg.jpg" />
					<div className="txt-darkBlue">
						New User 50% 1St Deposit Bonus
					</div>
					<div className="txt-dark">Promotions Details</div>
					<div className="txt-gray">
						<ul>
							<li>
								Only applicable for New user with FIRST success
								deposit.
							</li>
							<li>FIRST deposit amount x50% = Bonus amount.</li>
						</ul>
					</div>
					<div className="rollover">
						<div>
							<div className="icon icon-icon32px_time">
								Remaining Time
							</div>
							<div className="icon icon-icon32px_">Rollover</div>
						</div>
						<div className="txt-orange">
							<div>54 days 18 hours</div>
							<div>2X</div>
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
				<div>
					<img src="../img/proImg.jpg" />
					<div className="txt-darkBlue">
						New User 50% 1St Deposit Bonus
					</div>
					<div className="txt-dark">Promotions Details</div>
					<div className="txt-gray">
						<ul>
							<li>
								Only applicable for New user with FIRST success
								deposit.
							</li>
							<li>FIRST deposit amount x50% = Bonus amount.</li>
						</ul>
					</div>
					<div className="rollover">
						<div>
							<div className="icon icon-icon32px_time">
								Remaining Time
							</div>
							<div className="icon icon-icon32px_">Rollover</div>
						</div>
						<div className="txt-orange">
							<div>54 days 18 hours</div>
							<div>2X</div>
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
				<div>
					<img src="../img/proImg.jpg" />
					<div className="txt-darkBlue">
						New User 50% 1St Deposit Bonus
					</div>
					<div className="txt-dark">Promotions Details</div>
					<div className="txt-gray">
						<ul>
							<li>
								Only applicable for New user with FIRST success
								deposit.
							</li>
							<li>FIRST deposit amount x50% = Bonus amount.</li>
						</ul>
					</div>
					<div className="rollover">
						<div>
							<div className="icon icon-icon32px_time">
								Remaining Time
							</div>
							<div className="icon icon-icon32px_">Rollover</div>
						</div>
						<div className="txt-orange">
							<div>54 days 18 hours</div>
							<div>2X</div>
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
				<div>
					<img src="../img/proImg.jpg" />
					<div className="txt-darkBlue">
						New User 50% 1St Deposit Bonus
					</div>
					<div className="txt-dark">Promotions Details</div>
					<div className="txt-gray">
						<ul>
							<li>
								Only applicable for New user with FIRST success
								deposit.
							</li>
							<li>FIRST deposit amount x50% = Bonus amount.</li>
						</ul>
					</div>
					<div className="rollover">
						<div>
							<div className="icon icon-icon32px_time">
								Remaining Time
							</div>
							<div className="icon icon-icon32px_">Rollover</div>
						</div>
						<div className="txt-orange">
							<div>54 days 18 hours</div>
							<div>2X</div>
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
				<div>
					<img src="../img/proImg.jpg" />
					<div className="txt-darkBlue">
						New User 50% 1St Deposit Bonus
					</div>
					<div className="txt-dark">Promotions Details</div>
					<div className="txt-gray">
						<ul>
							<li>
								Only applicable for New user with FIRST success
								deposit.
							</li>
							<li>FIRST deposit amount x50% = Bonus amount.</li>
						</ul>
					</div>
					<div className="rollover">
						<div>
							<div className="icon icon-icon32px_time">
								Remaining Time
							</div>
							<div className="icon icon-icon32px_">Rollover</div>
						</div>
						<div className="txt-orange">
							<div>54 days 18 hours</div>
							<div>2X</div>
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
				<div>
					<img src="../img/proImg.jpg" />
					<div className="txt-darkBlue">
						New User 50% 1St Deposit Bonus
					</div>
					<div className="txt-dark">Promotions Details</div>
					<div className="txt-gray">
						<ul>
							<li>
								Only applicable for New user with FIRST success
								deposit.
							</li>
							<li>FIRST deposit amount x50% = Bonus amount.</li>
						</ul>
					</div>
					<div className="rollover">
						<div>
							<div className="icon icon-icon32px_time">
								Remaining Time
							</div>
							<div className="icon icon-icon32px_">Rollover</div>
						</div>
						<div className="txt-orange">
							<div>54 days 18 hours</div>
							<div>2X</div>
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
				<div>
					<img src="../img/proImg.jpg" />
					<div className="txt-darkBlue">
						New User 50% 1St Deposit Bonus
					</div>
					<div className="txt-dark">Promotions Details</div>
					<div className="txt-gray">
						<ul>
							<li>
								Only applicable for New user with FIRST success
								deposit.
							</li>
							<li>FIRST deposit amount x50% = Bonus amount.</li>
						</ul>
					</div>
					<div className="rollover">
						<div>
							<div className="icon icon-icon32px_time">
								Remaining Time
							</div>
							<div className="icon icon-icon32px_">Rollover</div>
						</div>
						<div className="txt-orange">
							<div>54 days 18 hours</div>
							<div>2X</div>
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
				<div>
					<img src="../img/proImg.jpg" />
					<div className="txt-darkBlue">
						New User 50% 1St Deposit Bonus
					</div>
					<div className="txt-dark">Promotions Details</div>
					<div className="txt-gray">
						<ul>
							<li>
								Only applicable for New user with FIRST success
								deposit.
							</li>
							<li>FIRST deposit amount x50% = Bonus amount.</li>
						</ul>
					</div>
					<div className="rollover">
						<div>
							<div className="icon icon-icon32px_time">
								Remaining Time
							</div>
							<div className="icon icon-icon32px_">Rollover</div>
						</div>
						<div className="txt-orange">
							<div>54 days 18 hours</div>
							<div>2X</div>
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
				<div>
					<img src="../img/proImg.jpg" />
					<div className="txt-darkBlue">
						New User 50% 1St Deposit Bonus
					</div>
					<div className="txt-dark">Promotions Details</div>
					<div className="txt-gray">
						<ul>
							<li>
								Only applicable for New user with FIRST success
								deposit.
							</li>
							<li>FIRST deposit amount x50% = Bonus amount.</li>
						</ul>
					</div>
					<div className="rollover">
						<div>
							<div className="icon icon-icon32px_time">
								Remaining Time
							</div>
							<div className="icon icon-icon32px_">Rollover</div>
						</div>
						<div className="txt-orange">
							<div>54 days 18 hours</div>
							<div>2X</div>
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
			</div>
			<div className="pagination">
				<a href="">❮</a>
				<a href="">1</a>
				<a href="" className="active">
					2
				</a>
				<a href="">3</a>
				<a href="">4</a>
				<a href="">5</a>
				<a href="">6</a>
				<a href="">7</a>
				<a href="">❯</a>
				<div className="inputBox pageSelect">
					<i className="txt-blue12">Records Per Page</i>
					<div className="dropdown">
						<button className="btn">1</button>
						<div className="dropdown-container">
							<div className="dropdown-item">2</div>
							<div className="dropdown-item">3</div>
							<div className="dropdown-item">4</div>
							<div className="dropdown-item">5</div>
							<div className="dropdown-item">6</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
