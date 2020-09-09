import React from "react";
import { number_format } from "../common/common";

export default ({
	custRollOver,
	custTurnOver,
	isJoin,
	t,
	currency,
	RefreshProcessBar,
	_isConvert,
	hideReloadBtn
}) => {
	if (isJoin) {
		let percentage =
			custTurnOver > custRollOver
				? 100
				: ((custTurnOver / custRollOver) * 100).toFixed(2);

		return (
			<div className="progressBarModule">
				<div className="bounsName">{t("lbl_TurnoverAccumulated")}</div>
				<div className="turnover">
					<span>
						{t(`Currency_${currency}`)}{" "}
						{number_format(custTurnOver, _isConvert)}
					</span>{" "}
					/ ({t("lbl_Req")} {t(`Currency_${currency}`)}{" "}
					{number_format(custRollOver, _isConvert)})
					{hideReloadBtn ? null : (
						<button
							aria-label="RefreshProcessBar"
							className="icon icon-spinner11"
							onClick={RefreshProcessBar}></button>
					)}
				</div>
				<div className="progressBar">
					<div className="bar">
						<div
							className="progress"
							style={{ width: `${percentage}%` }}></div>
					</div>
					<div className="percentage">{percentage}%</div>
				</div>
			</div>
		);
	} else {
		return <></>;
	}
};
