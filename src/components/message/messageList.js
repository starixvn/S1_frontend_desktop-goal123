import React, { useState, useEffect, useRef, useContext } from "react";
import {
	api_account_GetMsgContent,
	api_account_GetMsgCount
} from "../../service/api/account";
import { popBoxContext, msgCountContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { defPopBoxType } from "../common/popBox";
import moment from "moment";
import Loading from "../common/loading";

export default props => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const { setMsgCount } = useContext(msgCountContext);
	const isMountedRef = useRef(null);
	const [msgContentData, setMsgContentData] = useState("");
	const [showContent, setShowContent] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const getMsgContent = getMsg => {
		if (getMsg) {
			setLoading(true);

			api_account_GetMsgContent(props.id).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setShowContent(true);
							setMsgContentData(res.data.data.content);
							props.getMsgList();

							api_account_GetMsgCount().then(res => {
								if (isMountedRef.current) {
									if (res.data.errorCode === 0) {
										setMsgCount(res.data.data);
									}
								}
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
		} else {
			setShowContent(false);
		}
	};

	let compareDay = moment().diff(
		moment(props.createTime, "YYYY-MM-DD"),
		"day"
	);

	const dateTimeFormat = () => {
		if (showContent) {
			return moment(props.createTime).format("YYYY-MM-DD HH:MM:ss");
		} else {
			return compareDay < 1
				? moment(props.createTime).format("HH:MM:ss")
				: moment(props.createTime).format("YYYY-MM-DD");
		}
	};

	return loading ? (
		<Loading />
	) : (
		<div className={props.flag ? "haveRead" : ""}>
			<div className="listHeader">
				<div className="checkbox">
					<input
						type="checkbox"
						id={`msgList-checkBox-${props.id}`}
						onChange={props.onChangeCheck}
						checked={props.selectItems.includes(props.id)}
					/>
					<label
						aria-label="msgList-checkBox"
						htmlFor={`msgList-checkBox-${props.id}`}
						className="icon icon-checkbox-checked"></label>
				</div>
				<div
					onClick={getMsgContent.bind(this, !showContent)}
					role="button"
					onKeyDown={getMsgContent.bind(this, !showContent)}>
					{props.title}
				</div>
				<div
					className="txt-blue2"
					onClick={getMsgContent.bind(this, !showContent)}>
					{dateTimeFormat()}
					<button
						aria-label="getMsgContent"
						className="icon icon-keyboard_arrow_down"></button>
				</div>
			</div>
			<div className={`listBody ${showContent ? "active" : ""}`}>
				{msgContentData}
			</div>
		</div>
	);
};
