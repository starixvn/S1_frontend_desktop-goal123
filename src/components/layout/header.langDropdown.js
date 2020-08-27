import React, { useContext, useState, useEffect, useRef } from "react";
import DropdownHeader from "../common/dropdown.langList";
import { api_account_SetLanguage } from "../../service/api/account";
import { userInfoContext } from "../common/context";
import { Redirect } from "@reach/router";
import { useTranslation } from "react-i18next";

const SetReplaceChar = (str, idx, newChar) => {
	return `${str.substr(0, idx)}${newChar}${str.substr(idx + newChar.length)}`;
};

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const [redirectPath, setRedirectPath] = useState(null);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const handleLanguage = value => {
		if (value !== userInfo.langId) {
			const RedirectPage = () => {
				let url =
					window.location.pathname +
					window.location.search +
					window.location.hash;
				let newPathArr = SetReplaceChar(url, 1, value);
				setRedirectPath(newPathArr);
			};

			if (userInfo.isLogin) {
				api_account_SetLanguage(value).then(
					res => {
						if (isMountedRef.current) {
							if (res.data.errorCode === 0) {
								RedirectPage();
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
			} else {
				RedirectPage();
			}
		}
	};

	return redirectPath === null ? (
		<DropdownHeader
			mainKey={`header-langList`}
			className="country"
			subClassName="countryList"
			onSelectItem={handleLanguage}
			selectedValue={userInfo.langId}
		/>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
