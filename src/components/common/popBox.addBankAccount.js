import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api_payment_GetBankInfoSysList } from "../../service/api/payment";
import { api_accountStrict_SetCustBankInfo } from "../../service/api/accountStrict";
import { popBoxContext, userInfoContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import config from "../../config";
import Dropdown from "../common/dropdown";
import Inputbox from "../common/inputbox";

const initValue = {
	realName: "",
	bankId: 0,
	accountNo: ""
};

const initTip = {
	realName: "",
	accountNo: "",
	realName_after: ""
};

export default () => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const [bankInfoSysList, setBankInfoSysList] = useState([]);
	const [userValue, setUserValue] = useState(initValue);
	const [tip, setTip] = useState(initTip);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_payment_GetBankInfoSysList().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						const datas = res.data.data;
						let bankInfoArr = datas.map((item, i) => {
							return {
								id: i,
								sysId: item.sysId,
								displayText: item.bankName,
								image: item.bankLogo
							};
						});
						setBankInfoSysList(bankInfoArr);
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
	}, []);

	const onSelectItem = i => {
		setUserValue(prev => ({ ...prev, bankId: i }));
	};

	const editField = (col, e) => {
		let val = e.target.value;
		setUserValue(prev => ({ ...prev, [col]: val }));
	};

	const showTip = col => {
		let msg =
			col === "realName"
				? t("lbl_BankAccountNameHint")
				: t("lbl_ContactCSD");
		if (tip.realName_after !== "") {
			msg = "";
		}
		setTip(prev => {
			return { ...prev, [col]: msg };
		});
	};

	const closeTip = col => {
		setTip(prev => {
			return { ...prev, [col]: "" };
		});
	};

	const ClickCancel = () => {
		setPopBox({ isOpen: false });
	};

	const checkAll = () => {
		let checked = true;

		if (userInfo.accountName !== null && userInfo.accountName !== "") {
			if (userValue.accountNo === "") {
				setTip(prev => {
					return { ...prev, accountNo: t("msg_NeedAccountNo") };
				});
				checked = false;
			}
		} else {
			if (userValue.realName === "") {
				setTip(prev => {
					return { ...prev, realName: t("msg_EnterRealName") };
				});
				checked = false;
			} else if (userValue.accountNo === "") {
				setTip(prev => {
					return { ...prev, accountNo: t("msg_NeedAccountNo") };
				});
				checked = false;
			}
		}

		if (bankInfoSysList?.length <= 0) {
			console.log("Bank list is null.");
			checked = false;
		}

		return checked;
	};

	const ClickSubmit = () => {
		let checked = checkAll();

		if (checked) {
			api_accountStrict_SetCustBankInfo({
				AccountName: userValue.realName,
				AccountNo: userValue.accountNo,
				SysId: bankInfoSysList[userValue.bankId].sysId
			}).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setUserInfo(prev => ({
								...prev,
								accountName: userValue.realName
							}));
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.AddBankSuccess,
								btnBar: (
									<div className="btnGroup">
										<button
											className="btn-check"
											onClick={ClickCancel}>
											OK
										</button>
									</div>
								)
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
		}
	};

	return (
		<div className="addBankpop active">
			<span className="title">{t("lbl_AddNewAccount")}</span>
			<div className="txt-lightgray">{t("lbl_UpdateBankInfo")}</div>
			{!userInfo.accountName ? (
				<Inputbox
					value={userValue.realName}
					onChange={editField.bind(this, "realName")}
					placeholder={t("lbl_RealName")}
					onFocus={showTip.bind(this, "realName")}
					onBlur={closeTip.bind(this, "realName")}
					tip={tip.realName}
				/>
			) : (
				<>
					<div className="txt">
						<div>
							<span className="txt-blue2">
								{t("lbl_RealName")}
							</span>
							<span>{userInfo.accountName}</span>
						</div>
						<div
							className="iconModule"
							onClick={showTip.bind(this, "realName_after")}>
							<i className="icon icon-information-solid"></i>
						</div>
					</div>
					<div>{tip.realName_after}</div>
				</>
			)}
			<div className="inputBox">
				<Dropdown
					mainkey="bankList"
					options={bankInfoSysList}
					onSelectItem={onSelectItem}
					selectedIdx={userValue.bankId}
					imgUrl={`${config.imgUrl}/common/images/BankLogo/`}
					className="bankLogo"
				/>
			</div>
			<Inputbox
				value={userValue.accountNo}
				onChange={editField.bind(this, "accountNo")}
				placeholder={t("lbl_BankNumber")}
				tip={tip.accountNo}
			/>
			<div className="btnGroup">
				<button className="btn-cancel" onClick={ClickCancel}>
					{t("lbl_Cancel")}
				</button>
				<button className="btn-check" onClick={ClickSubmit}>
					{t("lbl_Submit")}
				</button>
			</div>{" "}
		</div>
	);
};
