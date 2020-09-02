import React, { useContext, useState, useEffect, useRef } from "react";
import moment from "moment";
import { number_format } from "../common/common";
import { userInfoContext, popBoxContext } from "../common/context";
import { api_payment_DepositReqWireTransfer } from "../../service/api/payment";
import { useTranslation } from "react-i18next";
import { Redirect } from "@reach/router";
import { defActionType } from "./locaLBank.reducer";
import { defPopBoxType } from "../common/popBox";
import config from "../../config";
import path from "../../path";
import Loading from "../common/loading";

export default ({ bankInfo, amount, _isConvert, dispatch }) => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const { userInfo } = useContext(userInfoContext);
	const [redirectPath, setRedirectPath] = useState(null);
	const [loading, setLoading] = useState(false);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const ClickCancel = () => {
		const ClickYes = () => {
			setPopBox({
				isOpen: false
			});
			setRedirectPath(`/${userInfo.langId}/${path.deposit.root}`);
		};

		const ClickNo = () => {
			setPopBox({ isOpen: false });
		};

		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Cancel,
			btnBar: (
				<div className="btnGroup">
					<button className="btn-cancel" onClick={ClickNo}>
						{t("lbl_No")}
					</button>
					<button className="btn-check" onClick={ClickYes}>
						{t("lbl_Yes")}
					</button>
				</div>
			)
		});
	};

	const ClickConfirm = () => {
		setLoading(true);

		const ClickClose = () => {
			setPopBox({ isOpen: false });
		};

		api_payment_DepositReqWireTransfer({
			amount: Number(amount),
			sysId: bankInfo.sysId
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let datas = res.data.data;

						const backDeposit = () => {
							setRedirectPath(
								`/${userInfo.langId}/${path.deposit.root}`
							);
						};

						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.UploadBankSlip,
							depositTime: `${moment().format(
								"yyyy-MM-DD "
							)}${moment().format("HH:mm A")}`,
							amount: number_format(amount, _isConvert),
							backDeposit: backDeposit,
							...datas
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

	return loading ? (
		<Loading />
	) : redirectPath === null ? (
		<div className="subModuleList">
			<div className="subModule">
				<div className="subModuleBody column align-items-center">
					<span className="title">{t("lbl_ImportantNote")}</span>
					<div className="txt-lightgray">
						{t("lbl_ConfirmDeposit")}
					</div>
					<div className="bankName">
						<img
							src={`${config.imgUrl}/common/images/BankLogo/${bankInfo.bankLogo}`}
							alt={bankInfo.bankName}
						/>
					</div>
					<div className="smallList">
						<ul>
							<li>{t("lbl_SelectedBank")}</li>
							<li>{bankInfo.bankName}</li>
						</ul>
						<ul>
							<li>{t("lbl_Amount")}</li>
							<li>
								{number_format(
									_isConvert ? amount * 1000 : amount,
									_isConvert
								)}
							</li>
						</ul>
					</div>
					<div className="btnGroup">
						<button onClick={ClickCancel} className="btn-cancel">
							{t("lbl_Cancel")}
						</button>
						<button onClick={ClickConfirm} className="btn-check">
							{t("lbl_Confirm")}
						</button>
					</div>
				</div>
			</div>
		</div>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
