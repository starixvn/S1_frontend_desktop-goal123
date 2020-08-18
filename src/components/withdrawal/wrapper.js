import React from "react";
import { useTranslation } from "react-i18next";
import StepBar from "../common/stepBar";
import defStep from "../withdrawal/defStep";

export default ({ step, children }) => {
	const { t } = useTranslation();

	return (
		<div className="infoModule">
			<div className="inside-title icon icon-transfer">
				<span>{t("lbl_Withdrawal")}</span>
			</div>
			<StepBar step={step} t={t} defStep={defStep} />
			{children}
		</div>
	);
};
