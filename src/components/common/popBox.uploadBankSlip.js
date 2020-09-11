import React, { useContext, useEffect, useRef } from "react";
import { popBoxContext, userInfoContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { Module } from "../deposit/deposit.bankSlip";

export default props => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const { userInfo } = useContext(userInfoContext);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const ClosePopBox = () => {
		setPopBox({
			isOpen: false
		});
		if (props.backDeposit) {
			props.backDeposit();
		}
	};

	return (
		<div className="upload active">
			<Module
				i18n={t}
				{...props}
				ClosePopBox={ClosePopBox}
				setPopBox={setPopBox}
				langId={userInfo.langId}
			/>
		</div>
	);
};
