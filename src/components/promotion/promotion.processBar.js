import React from "react";
import { number_format } from "../common/common";
import ReloadSpin from "../common/reloadSpin";
import { defPromotionType } from "./promotion.def";

export default ({
	custRollOver,
	custTurnOver,
	isJoin,
	t,
	currencyId,
	RefreshProcessBar,
	hideReloadBtn,
	promotionType
}) => {
	if (
		isJoin &&
		promotionType !== defPromotionType.cashback &&
		promotionType !== defPromotionType.rebate
	) {
		let percentage =
			custTurnOver > custRollOver
				? 100
				: ((custTurnOver / custRollOver) * 100).toFixed(2);

		return (
			<div className="progressBarModule">
				<div className="bounsName">{t("lbl_TurnoverAccumulated")}</div>
				<div className="turnover">
					<span>
						{t(`Currency_${currencyId}`)}{" "}
						{number_format(custTurnOver, false)}
					</span>{" "}
					/ ({t("lbl_Req")} {t(`Currency_${currencyId}`)}{" "}
					{number_format(custRollOver, false)})
					{hideReloadBtn ? null : (
						<ReloadSpin func={RefreshProcessBar} />
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
