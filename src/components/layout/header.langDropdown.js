import React, { useContext, useState, useEffect, useRef } from "react";
import DropdownHeader from "../common/dropdown.langList";
import { api_account_SetLanguage } from "../../service/api/account";
import { userInfoContext, popBoxContext } from "../common/context";
import { Redirect } from "@reach/router";
import { useTranslation } from "react-i18next";
import { defPopBoxType } from "../common/popBox";

const SetReplaceChar = (str, idx, newChar) => {
	return `${str.substr(0, idx)}${newChar}${str.substr(idx + newChar.length)}`;
};

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [redirectPath, setRedirectPath] = useState(null);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	return redirectPath === null ? (
		<DropdownHeader
			mainKey={`header-langList`}
			className="country"
			subClassName="countryList"
			selectedValue={userInfo.langId}
			isLogin={userInfo.isLogin}
		/>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
