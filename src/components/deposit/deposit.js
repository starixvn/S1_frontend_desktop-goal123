import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LocalBankList from "./localBank.list";
import OnlineBankList from "./onlineBank.list";
import MobilePayList from "./mobilePay.list";
import path from "../../path";
import { Redirect } from "@reach/router";
import { userInfoContext, popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [redirectPath, setRedirectPath] = useState(null);

	useEffect(() => {
		if (userInfo.isLogin === true) {
			if (
				(!userInfo.accountName && userInfo.accountName !== undefined) ||
				(!userInfo.phoneNo && userInfo.phoneNo !== undefined) ||
				(!userInfo.email && userInfo.email !== undefined)
			) {
				setPopBox({
					isOpen: true,
					popBoxType: defPopBoxType.UpdateProfile,
					title: t("lbl_ImportantNote"),
					content: t("lbl_UpdatePersonalInfo"),
					btnBar: (
						<div className="btnGroup">
							<button className="btn-check" onClick={toProfile}>
								{t("lbl_UpdatePersonalDetail")}
							</button>
						</div>
					)
				});
			}
		}
	}, [userInfo]);

	const toProfile = () => {
		setRedirectPath(`/${userInfo.langId}/${path.profile.root}`);
	};

	return redirectPath === null ? (
		<div className="subModuleList">
			<MobilePayList />
			<OnlineBankList />
			<LocalBankList />
		</div>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
