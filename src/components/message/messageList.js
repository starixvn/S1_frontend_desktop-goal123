import React, { useState, useEffect, useRef } from "react";
import { api_account_GetMsgContent } from "../../service/api/account";
import { useTranslation } from "react-i18next";
import moment from "moment";

export default props => {
	const { t } = useTranslation();
	const isMountedRef = useRef(null);
	const [displayTime, setDisplayTime] = useState("");
	const [msgContentData, setMsgContentData] = useState("");
	const [showContent, setShowContent] = useState(false);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		getDisplayTime();
	}, []);

	const getDisplayTime = () => {
		let compareDay = moment().diff(
			moment(props.createTime, "YYYY-MM-DD"),
			"day"
		);
		if (compareDay < 1) {
			setDisplayTime(props.createTime.slice(11, 19));
		} else {
			setDisplayTime(props.createTime.split("T", 1));
		}
	};

	const getMsgContent = () => {
		api_account_GetMsgContent(props.id).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setShowContent(!showContent);
						setMsgContentData(res.data.data.content);
						props.getMsgList(props.page);
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

	return (
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
						htmlFor={`msgList-checkBox-${props.id}`}
						className="icon icon-checkbox-checked"></label>
				</div>
				<div>{props.title}</div>
				<div className="txt-blue2">
					{displayTime}
					<button
						className="icon icon-keyboard_arrow_down"
						onClick={getMsgContent}></button>
				</div>
			</div>
			<div className={`listBody ${showContent ? "active" : ""}`}>
				{msgContentData}
			</div>
		</div>
	);
};
