import React, { useState, useEffect, useRef, useContext } from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
<<<<<<< HEAD
import LeftMenu from "../components/common/leftMenu";
=======
>>>>>>> fe6f38139337e679f13545fa34bce57e3b6f3fcd
import path from "../path";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../components/common/context";
import { api_news_GetNews } from "../service/api/news";
import { Pagination } from "../components/common/pagination";
<<<<<<< HEAD
import { Redirect } from "@reach/router";
=======
import { Link } from "@reach/router";
>>>>>>> fe6f38139337e679f13545fa34bce57e3b6f3fcd

export default () => {
	return (
		<Wrapper>
			<Layout>
				<main>
					<section className="inside">
<<<<<<< HEAD
						<LeftMenu />
=======
>>>>>>> fe6f38139337e679f13545fa34bce57e3b6f3fcd
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
<<<<<<< HEAD
	const [redirectPath, setRedirectPath] = useState(null);
=======
>>>>>>> fe6f38139337e679f13545fa34bce57e3b6f3fcd
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

<<<<<<< HEAD
	const openNews = newsId => {
		setRedirectPath(
			`/${userInfo.langId}/${path.newsInfo.root}?newsId=${newsId}`
		);
	};

=======
>>>>>>> fe6f38139337e679f13545fa34bce57e3b6f3fcd
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
<<<<<<< HEAD
					<button
						className="blue"
						onClick={openNews.bind(this, item.newsId)}>
						{t("lbl_Details")}
					</button>
=======
					<Link
						className="blue"
						to={`/${userInfo.langId}/${path.news.root}/${path.news.sub.newsInfo.root}?newsId=${item.newsId}`}>
						{t("lbl_Details")}
					</Link>
>>>>>>> fe6f38139337e679f13545fa34bce57e3b6f3fcd
				</div>
			</div>
		);
	});

<<<<<<< HEAD
	return redirectPath === null ? (
=======
	return (
>>>>>>> fe6f38139337e679f13545fa34bce57e3b6f3fcd
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
<<<<<<< HEAD
	) : (
		<Redirect to={redirectPath} noThrow />
=======
>>>>>>> fe6f38139337e679f13545fa34bce57e3b6f3fcd
	);
};
