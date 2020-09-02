import React, { useEffect, useRef, useState, useContext } from "react";
import Wrapper from "../../components/common/wrapper";
import Layout from "../../components/common/layout";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../../components/common/context";
import { getUrlParameter } from "../../components/common/common";
import { api_news_GetNewsById } from "../../service/api/news";
import Loading from "../../components/common/loading";

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
	const [loading, setLoading] = useState(true);
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
					setLoading(false);
				}
			},
			err => {
				if (isMountedRef.current) {
					alert(t("msg_ApiServerError"));
					setLoading(false);
				}
			}
		);
	};

	return (
		<div className="infoModule">
			<article>
				<img src={newsInfo.imageURL} />
				<h1>{newsInfo.title}</h1>
				<pre>{newsInfo.content}</pre>
			</article>
		</div>
	);
};
