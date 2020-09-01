import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@reach/router";
import {
	GET_OPEN_RULE,
	_ACTION_TYPE,
	OPEN_IN_BLANK
} from "../../service/enterPage";
import { userInfoContext, popBoxContext } from "../common/context";
import { defMenuLinks } from "./header.menu.def";
import { defPopBoxType } from "../common/popBox";

const getUrl = (preUrl, info) => {
	return `/${preUrl}?tpId=${info.tpId}&gameId=${info.gameId}`;
};

export default ({ showSubMenu }) => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);

	let currentPage =
		typeof window !== undefined
			? `${window.location.pathname}${window.location.search}`
			: "";

	const showLogin = () => {
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Login
		});
	};

	let rows = Object.keys(defMenuLinks).map(key => {
		let m = defMenuLinks[key];
		let _className = "";
		if (m.productInfo) {
			let rule = GET_OPEN_RULE(
				userInfo.langId,
				m.productInfo.tpId,
				m.productInfo.gameId
			);

			let isBlank = rule.actionType === _ACTION_TYPE.blank;

			if (rule.needLogin && userInfo.isLogin === false) {
				return (
					<button
						key={key}
						onClick={showLogin}
						className={_className}
						onMouseOver={showSubMenu.bind(this, key)}>
						{t(m.displayKey)}
					</button>
				);
			} else if (isBlank) {
				return (
					<a
						key={key}
						className={_className}
						onMouseOver={showSubMenu.bind(this, key)}
						onClick={OPEN_IN_BLANK.bind(
							this,
							rule.entPageUrl,
							rule.windowKey
						)}>
						{t(m.displayKey)}
					</a>
				);
			} else {
				let _url = getUrl(
					`${userInfo.langId}/${m.path}`,
					m.productInfo
				);

				_className = _url === currentPage ? "active" : "";
				return (
					<Link
						key={key}
						to={_url}
						className={_className}
						onMouseOver={showSubMenu.bind(this, key)}>
						{t(m.displayKey)}
					</Link>
				);
			}
		} else {
			_className =
				`${userInfo.langId}/${m.path}` === currentPage ? "active" : "";
			return (
				<Link
					key={key}
					to={`${userInfo.langId}/${m.path}`}
					onMouseOver={showSubMenu.bind(this, key)}
					className={_className}>
					{t(m.displayKey)}
				</Link>
			);
		}
	});

	return (
		<>
			<Link
				to={`/${userInfo.langId}`}
				className={
					currentPage === `/${userInfo.langId}` ? "active" : ""
				}>
				<i className="icon icon-home"></i>
			</Link>
			{rows}
		</>
	);
};
