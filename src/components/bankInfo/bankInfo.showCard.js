import React, { useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import config from "../../config";
import { popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import { api_accountStrict_DelCustBankInfo } from "../../service/api/accountStrict";

export default ({ accountName, custBankList, reload }) => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const delBankAccount = (sysId, accountNo) => {
		const ClickCancel = () => {
			setPopBox({
				isOpen: false
			});
		};

		const deleteCard = (sysId, accountNo) => {
			api_accountStrict_DelCustBankInfo({
				AccountName: accountName,
				AccountNo: accountNo,
				SysId: sysId
			}).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							reload();
							setPopBox({
								isOpen: false
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
		};

		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.TitleWithButton,
			message: t("lbl_CheckConfirm"),
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

	let arr = custBankList?.map(item => {
		return (
			<div className="addBankName" key={`bankCard-${item.accountNo}`}>
				<div className="addBankInfo">
					<div className="bankName">
						<img
							src={`${config.imgUrl}/common/images/BankLogo/${item.bankLogo}`}
						/>
					</div>
				</div>
				<div className="addBankInfo">
					<div className="txt-blue2">{item.accountNo}</div>
					<button
						className="icon icon-bin"
						onClick={delBankAccount.bind(
							this,
							item.sysId,
							item.accountNo
						)}></button>
				</div>
			</div>
		);
	});
	return (
		<>
			{custBankList?.length > 0 ? (
				<div className="infoModule">
					<div className="walletModule">
						<div className="addBank haveBank">{arr}</div>
					</div>
				</div>
			) : null}
		</>
	);
};
