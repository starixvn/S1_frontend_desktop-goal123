import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../common/context";

export default props => {
	const { t } = useTranslation();
	return (
		<div className="subModuleList kycHeight">
			<div className="subModule">
				<div className="subModuleBody column align-items-center">
					<div className="icon icon-icon32px_worker"></div>
					<span className="title txt-yellow">{t("lbl_WaitKYC")}</span>
					<div className="txt-lightgray">{t("lbl_WaitKYCHint")}</div>
				</div>
			</div>
		</div>
	);
};
