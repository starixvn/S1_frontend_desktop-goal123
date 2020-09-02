import React, { useEffect, useRef, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../components/common/context";
import { api_message_GetAnnouncement } from "../service/api/message";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import LeftMenu from "../components/common/leftMenu";
import moment from "moment";
import Loading from "../components/common/loading";
import { defPopBoxType } from "../components/common/popBox";

export default () => {
	return (
		<Wrapper afterLogin={true}>
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
	const [getAnnouncement, setGetAnnouncement] = useState([]);
	const [loading, setLoading] = useState(true);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_message_GetAnnouncement(userInfo.langId).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setGetAnnouncement(res.data.data);
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
	}, []);

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	let arr = getAnnouncement?.map(item => {
		let isToday =
			moment(item.startTime).format("YYYY-MM-DD") ===
			moment().format("YYYY-MM-DD");

		let displayTime = isToday
			? moment(item.startTime).format("hh:mm:ss A")
			: moment(item.startTime).format("MM/DD/YYYY");

		let textColor = isToday ? "txt-blue2" : "";

		return (
			<div key={`announcement-${item.id}`}>
				<div className="listHeader">
					<div>{item.subject}</div>
					<div className={textColor}>{displayTime}</div>
				</div>
				<pre className="listBody">{item.content}</pre>
			</div>
		);
	});

	return loading ? (
		<Loading />
	) : (
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_openmail">
				<span>{t("lbl_Announcement")}</span>
			</div>
			<div className="announcement">
				<div className="list">{arr}</div>
			</div>
		</div>
	);
};
