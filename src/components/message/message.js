import React, { useState, useEffect, useRef, useContext } from "react";
import {
	api_account_GetMsgList,
	api_account_DelMsg,
	api_account_GetMsgCount
} from "../../service/api/account";
import { useTranslation } from "react-i18next";
import MessageList from "./messageList";
import { Pagination } from "../common/pagination";
import { popBoxContext, msgCountContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import Loading from "../common/loading";
import ReloadSpin from "../common/reloadSpin";

export default () => {
	const { t } = useTranslation();
	const isMountedRef = useRef(null);
	const [msgListData, setMsgListData] = useState([]);
	const [pagination, setPagination] = useState({
		totalPages: 0,
		currentPage: 1
	});
	const { setMsgCount } = useContext(msgCountContext);
	const { setPopBox } = useContext(popBoxContext);
	const [selectItems, setSelectItems] = useState([]);
	const [isCheckAll, setIsCheckAll] = useState(false);
	const [loading, setLoading] = useState(true);

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

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

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

		const deleteMessage = () => {
			setPopBox({ isOpen: false });
			setLoading(true);

			api_account_DelMsg(selectItems).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							getMsgList(pagination.currentPage);
							setSelectItems([]);
							setIsCheckAll(false);

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
		};

		if (selectItems.length > 0) {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.ConfirmDelete,
				message: t("lbl_AreYouSureDelete"),
				message2: t("lbl_CantBeRestore"),
				btnBar: (
					<div className="btnGroup">
						<button className="btn-cancel" onClick={deleteMessage}>
							{t("lbl_Yes")}
						</button>
						<button className="btn-check" onClick={ClickCancel}>
							{t("lbl_No")}
						</button>
					</div>
				)
			});
		}
	};

	return loading ? (
		<Loading />
	) : (
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_openmail">
				<span>{t("lbl_PersonalMsg")}</span>
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
							aria-label="popDelete"
							className="icon icon-bin"
							onClick={popDelete}></button>
						<ReloadSpin
							func={getMsgList.bind(this, pagination.currentPage)}
						/>
					</div>

					{msgListData.map(item => (
						<MessageList
							{...item}
							key={`msgList-${item.id}`}
							onChangeCheck={onChildChanged.bind(this, item.id)}
							parentIsCheckAll={isCheckAll}
							selectItems={selectItems}
							getMsgList={getMsgList.bind(
								this,
								pagination.currentPage
							)}
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
