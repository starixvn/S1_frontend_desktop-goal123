import React from "react";
import { useTranslation } from "react-i18next";
import { defActionType } from "./bankInfo.reducer";

export default ({ dispatch }) => {
	const { t } = useTranslation();
	const toNextStep = () => {
		dispatch({ type: defActionType.TO_NEXT_STEP });
	};

	return (
		<div className="walletModule">
			<div className="addBank">
				<div className="addBankName noBank" onClick={toNextStep}>
					<div className="icon icon-plus"></div>
					<div className="txt-yellow">{t("lbl_AddNewAccount")}</div>
				</div>
				<div className="remainder">
					{t("lbl_NumberOfBankAccounts")}: 0/3
				</div>
			</div>
		</div>
	);
};
