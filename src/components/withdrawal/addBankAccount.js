import React, { useContext, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import { api_payment_GetBankInfoSysList } from "../../service/api/payment";

export default props => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const openPopBox = () => {
		const ClickClose = () => {
			setPopBox({ isOpen: false });
		};

		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.AddBankAccount,
			loading: true
		});

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

						setPopBox(prevP => ({
							...prevP,
							loading: false,
							bankInfoSysList: bankInfoArr
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
						setPopBox(prevP => ({
							...prevP,
							loading: false
						}));
					}
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
					setPopBox(prevP => ({
						...prevP,
						loading: false
					}));
				}
			}
		);
	};

	const showAddButton = props.allBankCardData.length < 3 ? true : false;

	return (
		<>
			{showAddButton ? (
				<div className="addBankName noBank" onClick={openPopBox}>
					<div className="icon icon-plus"></div>
					<div className="txt-yellow">{t("lbl_AddNewAccount")}</div>
				</div>
			) : (
				<></>
			)}
		</>
	);
};
