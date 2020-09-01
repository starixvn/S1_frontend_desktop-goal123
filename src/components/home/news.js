import React, { useContext, useState, useEffect, useRef } from "react";
import { userInfoContext } from "../common/context";
import { Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import { api_news_GetNews } from "../../service/api/news";
import { Redirect } from "@reach/router";
import path from "../../path";

export default () => {
	const { userInfo } = useContext(userInfoContext);
	const { t } = useTranslation();
	const [getNews, setGetNews] = useState([]);
	const [redirectPath, setRedirectPath] = useState(null);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_news_GetNews({
			langId: userInfo.langId,
			PageNumber: 1,
			PageSize: 4
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setGetNews(res.data.data);
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

	const newsRows = getNews.map((item, i) => {
		return (
			<Link
				key={`index-news-${i}`}
				to={`${userInfo.langId}/${path.newsInfo.root}?newsId=${item.newsId}`}>
				<img src={item.imageURL} />
				<div className="title">{item.title}</div>
			</Link>
		);
	});

	return redirectPath === null ? (
		<>
			<div className="news">
				<div>
					<div className="title">Goal123 {t("lbl_News")}</div>
					<span></span>
				</div>
				<div className="articleModule">{newsRows}</div>
			</div>
			<div className="btnGroup">
				<Link
					to={`${userInfo.langId}/${path.news.root}`}
					className="yellowborder">
					{t("lbl_ViewAll")}
				</Link>
			</div>
		</>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
