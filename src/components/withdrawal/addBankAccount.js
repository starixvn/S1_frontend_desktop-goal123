import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";

export default props => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);

	const openPopBox = () => {
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.AddBankAccount,
			refresh: false
		});
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
