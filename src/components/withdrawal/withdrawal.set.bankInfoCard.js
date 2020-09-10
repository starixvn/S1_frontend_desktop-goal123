import React, { useEffect, useState, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { api_account_GetCustBankInfo } from "../../service/api/account";
import { api_accountStrict_DelCustBankInfo } from "../../service/api/accountStrict";
import config from "../../config";
import { popBoxContext, userInfoContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import Loading from "../common/loading";

export default props => {
	const [bankInfoList, setBankInfoList] = useState([]);
	const [hasCheckedKey, setHasCheckedKey] = useState();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [loading, setLoading] = useState(true);
	const isMountedRef = useRef(null);
	const { t } = useTranslation();
	const popBoxData = useContext(popBoxContext).popBox;

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		getApiBankCard();
	}, []);

	useEffect(() => {
		props.allBankCardData(bankInfoList);
	}, [bankInfoList]);

	useEffect(() => {
		if (popBoxData.refresh === true) {
			getApiBankCard();
		}
	}, [popBoxData.refresh]);

	const getApiBankCard = () => {
		api_account_GetCustBankInfo().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						if (
							res.data.data &&
							res.data.data.bankInfoDetail?.length > 0
						) {
							setBankInfoList(res.data.data.bankInfoDetail);
						}
					}
					setLoading(false);
				}
			},
			err => {
				if (isMountedRef.current) {
					//
					setLoading(false);
				}
			}
		);
	};

	const checkInput = (sysId, accountNo, bankName) => {
		let value = hasCheckedKey === accountNo ? "" : accountNo;
		setHasCheckedKey(value);
		if (value) {
			props.bankCardValue(sysId, accountNo, bankName);
		} else {
			props.bankCardValue(0, 0, "");
		}
	};

	const popDelete = (sysId, accountNo) => {
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.ConfirmDelete,
			message: t("lbl_AreYouSureDelete"),
			message2: t("lbl_CantBeRestore"),
			btnBar: (
				<div className="btnGroup">
					<button className="btn-cancel" onClick={ClickCancel}>
						{t("lbl_No")}
					</button>
					<button
						className="btn-check"
						onClick={deleteCard.bind(this, sysId, accountNo)}>
						{t("lbl_Yes")}
					</button>
				</div>
			)
		});
	};

	const ClickCancel = () => {
		setPopBox({ isOpen: false });
	};

	const deleteCard = (sysId, accountNo) => {
		setPopBox({ isOpen: false });
		setLoading(true);

		api_accountStrict_DelCustBankInfo({
			AccountName: userInfo.accountName,
			AccountNo: accountNo,
			SysId: sysId
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setBankInfoList(
							bankInfoList.filter(
								item => item.accountNo !== accountNo
							)
						);
					} else {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickCancel}>
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
									onClick={ClickCancel}>
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

	let bankCardArr = bankInfoList.map(item => {
		let key = `withdrawal-banklist-${item.accountNo}`;
		let checkKey = `${key}-check`;

		return (
			<div className="addBankName" key={key}>
				<div className="addBankInfo">
					<div className="bankName">
						<img
							src={`${config.imgUrl}/common/images/BankLogo/${item.bankLogo}`}
							alt={item.bankName}
						/>
					</div>
					<div className="checkbox">
						<input
							type="checkbox"
							checked={hasCheckedKey === item.accountNo}
							onChange={checkInput.bind(
								this,
								item.sysId,
								item.accountNo,
								item.bankName
							)}
							id={checkKey}
						/>
						<label
							htmlFor={checkKey}
							className="icon icon-checkbox-checked"></label>
					</div>
				</div>
				<div className="addBankInfo">
					<div className="txt-blue2">
						<span>{item.accountNo?.slice(0, 4)}</span>
						<span>{item.accountNo?.slice(4, 8)}</span>
						<span>{item.accountNo?.slice(8, 12)}</span>
						<span>{item.accountNo?.slice(12, 16)}</span>
					</div>
					<div
						className="icon icon-bin"
						onClick={popDelete.bind(
							this,
							item.sysId,
							item.accountNo
						)}></div>
				</div>
			</div>
		);
	});

	return loading ? <Loading /> : bankCardArr;
};
