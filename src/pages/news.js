import React, { useState, useEffect, useRef, useContext } from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import path from "../path";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../components/common/context";
import { api_news_GetNews } from "../service/api/news";
import { Pagination } from "../components/common/pagination";
import { Link } from "@reach/router";
import Loading from "../components/common/loading";
import { defPopBoxType } from "../components/common/popBox";

export default () => {
	return (
		<Wrapper>
			<Layout>
				<main>
					<section className="inside">
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
	const { setPopBox } = useContext(popBoxContext);
	const [getNews, setGetNews] = useState();
	const [processing, setProcessing] = useState(false);
	const [pagination, setPagination] = useState({
		totalPages: 0,
		currentPage: 1
	});
	const [loading, setLoading] = useState(true);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		GetNews(1);
	}, []);

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

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
					setLoading(false);
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
					setLoading(false);
				}
			}
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
				<img src={item.imageURL} alt={item.title} />
				<div className="txt-darkBlue">{item.title}</div>
				<div className="txt-gray">{item.content}</div>
				<div className="btnGroup">
					<Link
						className="blue"
						to={`/${userInfo.langId}/${path.news.root}/${path.news.sub.newsInfo.root}?newsId=${item.newsId}`}>
						{t("lbl_Details")}
					</Link>
				</div>
			</div>
		);
	});

	return loading ? (
		<Loading />
	) : (
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
	);
};
