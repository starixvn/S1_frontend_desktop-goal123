import React, { useState, useEffect, useRef, useContext } from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import LeftMenu from "../components/common/leftMenu";
import path from "../path";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../components/common/context";
import { api_news_GetNews } from "../service/api/news";
import { Pagination } from "../components/common/pagination";
import { Redirect } from "@reach/router";

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
	const [getNews, setGetNews] = useState();
	const [processing, setProcessing] = useState(false);
	const [redirectPath, setRedirectPath] = useState(null);
	const [pagination, setPagination] = useState({
		totalPages: 0,
		currentPage: 1
	});
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		GetNews(1);
	}, []);

	const GetNews = pageNumber => {
		api_news_GetNews({
			langId: userInfo.langId,
			PageNumber: pageNumber,
			PageSize: 15
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setGetNews(res.data.data);
						setPagination(prev => ({
							...prev,
							totalPages: res.data.totalPages
						}));
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

	const openNews = newsId => {
		setRedirectPath(
			`/${userInfo.langId}/${path.newsInfo.root}?newsId=${newsId}`
		);
	};

	const clickPageNumber = page => {
		if (!processing) {
			setProcessing(true);
			setPagination(prev => ({ ...prev, currentPage: page }));
			GetNews(page);
		}
	};

	let arr = getNews?.map(item => {
		return (
			<div key={`News-${item.newsId}`}>
				<img src={item.imageURL} />
				<div className="txt-darkBlue">{item.title}</div>
				<div className="txt-gray">{item.content}</div>
				<div className="btnGroup">
					<button
						className="blue"
						onClick={openNews.bind(this, item.newsId)}>
						{t("lbl_Details")}
					</button>
				</div>
			</div>
		);
	});

	return redirectPath === null ? (
		<div className="infoModule">
			<div className="inside-title icon icon-newspaper">
				<span>{t("lbl_News")}</span>
			</div>
			<div className="newsList">{arr}</div>
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
