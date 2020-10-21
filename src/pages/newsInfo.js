import React, { useEffect, useRef, useState, useContext } from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import LeftMenu from "../components/common/leftMenu";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../components/common/context";
import { getUrlParameter } from "../components/common/common";
import { api_news_GetNewsById } from "../service/api/news";
import { Redirect } from "@reach/router";
import path from "../path";
import Loading from "../components/common/loading";
import { defPopBoxType } from "../components/common/popBox";

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
	const { setPopBox } = useContext(popBoxContext);
	const [redirectPath, setRedirectPath] = useState(null);
	const [newsInfo, setNewsInfo] = useState({
		title: "",
		content: "",
		imgURL: ""
	});
	const [loading, setLoading] = useState(true);
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

		const ClickClose = () => {
			setPopBox({ isOpen: false });
		};

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

	const clickBack = () => {
		setRedirectPath(`/${userInfo.langId}/${path.news.root}`);
	};

	return loading ? (
		<Loading />
	) : redirectPath === null ? (
		<div className="infoModule">
			<a className="icon icon-arrow-left2" onClick={clickBack}>
				{t("lbl_BackToNews")}
			</a>
			<article>
				<img src={newsInfo.imageURL} alt={newsInfo.title} />
				<h1>{newsInfo.title}</h1>
				<pre>{newsInfo.content}</pre>
			</article>
		</div>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
