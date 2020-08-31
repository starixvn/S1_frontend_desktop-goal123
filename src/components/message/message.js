import React, { useState, useEffect, useRef, useContext } from "react";
import {
	api_account_GetMsgList,
	api_account_DelMsg
} from "../../service/api/account";
import { useTranslation } from "react-i18next";
import MessageList from "./messageList";
import { Pagination } from "../common/pagination";
import { popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";

export default () => {
	const { t } = useTranslation();
	const isMountedRef = useRef(null);
	const [msgListData, setMsgListData] = useState([]);
	const [pagination, setPagination] = useState({
		totalPages: 0,
		currentPage: 1
	});
	const { setPopBox } = useContext(popBoxContext);
	const [selectItems, setSelectItems] = useState([]);
	const [isCheckAll, setIsCheckAll] = useState(false);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const clickPageNumber = page => {
		setPagination(prev => ({ ...prev, currentPage: page }));
		getMsgList(page);
	};

	useEffect(() => {
		getMsgList(pagination.currentPage);
	}, []);

	const getMsgList = pageNumber => {
		api_account_GetMsgList({ PageNumber: pageNumber }).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setMsgListData(res.data.data);
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

	const onClickCheckAll = () => {
		let checkAll = !isCheckAll;
		setIsCheckAll(checkAll);
		if (checkAll) {
			setSelectItems(msgListData.map(item => item.id));
		} else {
			setSelectItems([]);
		}
	};

	const onChildChanged = checkId => {
		setSelectItems([...selectItems, checkId]);
		let result = [];
		if (selectItems.includes(checkId)) {
			result = selectItems.filter(item => item !== checkId);
			if (result.length < 5) {
				setIsCheckAll(false);
			}
		} else {
			result = [...selectItems, checkId];
			if (result.length === 5) {
				setIsCheckAll(true);
			}
		}
		setSelectItems(result);
	};

	const popDelete = () => {
		const ClickCancel = () => {
			setPopBox({ isOpen: false });
		};
		if (selectItems.length > 0) {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.TitleWithButton,
				message: t("lbl_CheckConfirm"),
				btnBar: (
					<div className="btnGroup">
						<button className="btn-cancel" onClick={ClickCancel}>
							{t("lbl_No")}
						</button>
						<button className="btn-check" onClick={deleteMessage}>
							{t("lbl_Yes")}
						</button>
					</div>
				)
			});
		}
	};

	const deleteMessage = () => {
		api_account_DelMsg(selectItems).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						getMsgList(pagination.currentPage);
						setSelectItems([]);
						setIsCheckAll(false);
						setPopBox({ isOpen: false });
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
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_openmail">
				<span>{t("lbl_Message")}</span>
			</div>
			<div className="personal">
				<div className="list">
					<div className="functionMenu">
						<div className="checkbox">
							<input
								type="checkbox"
								id={`message-selectAll`}
								onChange={onClickCheckAll}
								checked={isCheckAll}
							/>
							<label
								htmlFor={`message-selectAll`}
								className="icon icon-checkbox-checked"></label>
						</div>
						<button
							className="icon icon-bin"
							onClick={popDelete}></button>
						<button
							className="icon icon-spinner11"
							onClick={() =>
								getMsgList(pagination.currentPage)
							}></button>
					</div>

					{msgListData.map(item => (
						<MessageList
							{...item}
							key={`msgList-${item.id}`}
							onChangeCheck={onChildChanged.bind(this, item.id)}
							parentIsCheckAll={isCheckAll}
							selectItems={selectItems}
							getMsgList={getMsgList}
							page={pagination.currentPage}
						/>
					))}
				</div>
			</div>
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
