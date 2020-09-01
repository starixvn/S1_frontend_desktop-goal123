import React, { useEffect, useRef, useState, useContext } from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import LeftMenu from "../components/common/leftMenu";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../components/common/context";
import { getUrlParameter } from "../components/common/common";
import { api_news_GetNewsById } from "../service/api/news";
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
	const [newsInfo, setNewsInfo] = useState({
		title: "",
		content: "",
		imgURL: ""
	});
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		openNews();
	}, []);

	const openNews = () => {
		let newsId = getUrlParameter("newsId");

		api_news_GetNewsById({
			langId: userInfo.langId,
			NewsId: Number(newsId)
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let datas = res.data.data;
						setNewsInfo({
							title: datas.title,
							content: datas.content,
							imageURL: datas.imageURL
						});
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

	const clickBack = () => {
		setRedirectPath(`/${userInfo.langId}/${path.news.root}`);
	};

	return redirectPath === null ? (
		<div className="infoModule">
			<a className="icon icon-arrow-left2" onClick={clickBack}>
				{t("lbl_BackToNews")}
			</a>
			<article>
				<img src={newsInfo.imageURL} />
				<h1>{newsInfo.title}</h1>
				<pre>{newsInfo.content}</pre>
			</article>
		</div>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
