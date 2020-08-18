import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";

export default () => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);

	const openPopBox = () => {
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.AddBankAccount
		});
	};

	return (
		<div className="addBank" onClick={openPopBox}>
			<div className="addBankName noBank">
				<div className="icon icon-plus"></div>
				<div className="txt-yellow">{t("lbl_AddNewAccount")}</div>
			</div>
			<div className="remainder">
				{t("lbl_NumberOfBankAccounts")}: 0/3
			</div>
		</div>
	);
};
