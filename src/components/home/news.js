import React, { useContext, useState, useEffect, useRef } from "react";
import { userInfoContext, popBoxContext } from "../common/context";
import { Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import { api_news_GetNews } from "../../service/api/news";
import { defPopBoxType } from "../common/popBox";
import path from "../../path";

export default () => {
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const { t } = useTranslation();
	const [getNews, setGetNews] = useState([]);
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
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={ClickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			}
		);
	}, [userInfo.langId]);

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const newsRows = getNews.map((item, i) => {
		return (
			<Link
				key={`index-news-${i}-${userInfo.langId}`}
				to={`/${userInfo.langId}/${path.news.root}/${path.news.sub.newsInfo.root}?newsId=${item.newsId}`}>
				<img src={item.imageURL} alt="news" />
				<div className="title">{item.title}</div>
			</Link>
		);
	});

	return (
		<>
			<div className="news">
				<div>
					<div className="title">{t("lbl_Goal123News")}</div>
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
	);
};
