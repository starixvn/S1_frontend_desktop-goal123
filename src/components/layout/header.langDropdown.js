import React, { useContext, useState } from "react";
import DropdownHeader from "../common/dropdown.langList";
import { userInfoContext } from "../common/context";
import { Redirect } from "@reach/router";

const SetReplaceChar = (str, idx, newChar) => {
	return `${str.substr(0, idx)}${newChar}${str.substr(idx + newChar.length)}`;
};

export default () => {
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const [redirectPath, setRedirectPath] = useState(null);

	const handleLanguage = value => {
		if (value !== userInfo.langId) {
			let url =
				window.location.pathname +
				window.location.search +
				window.location.hash;
			let newPathArr = SetReplaceChar(url, 1, value);
			setUserInfo(value);
			setRedirectPath(newPathArr);
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
