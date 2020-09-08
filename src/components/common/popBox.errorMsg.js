import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar, message, errorCode }) => {
	const { t } = useTranslation();
	const [seconds, setSeconds] = useState(300);
	const [hasTooManyRequestError] = useState(errorCode === 1004);

	useEffect(() => {
		const countDownSecond = seconds;
		const startTime = Date.now();
		const countDownTimerID = setInterval(() => {
			// 計算剩餘秒數
			const pastSeconds = parseInt((Date.now() - startTime) / 1000);
			const remain = countDownSecond - pastSeconds;
			setSeconds(remain < 0 ? 0 : remain);

			// 檢查是否結束
			if (remain <= 0) {
				clearInterval(countDownTimerID);
			}
		}, 1000);

		return () => {
			clearInterval(countDownTimerID);
		};
	}, []);

	return (
		<div className="Success active">
			<div className="icon icon-library"></div>
			<div className="title">{t("lbl_Information")}</div>
			<div className="txt-lightgray">
				{message}
				{hasTooManyRequestError ? (
					<span> {`( ${seconds} )`}</span>
				) : null}
			</div>
			{btnBar}
		</div>
	);
};
