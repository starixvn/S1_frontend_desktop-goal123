import React from "react";
import { defPromotionType } from "./promotion.def";

export const defFilterType = {
	all: 0,
	expiry: 999,
	firstDeposit: defPromotionType.firstDeposit,
	redeposit: defPromotionType.redeposit,
	freeBet: defPromotionType.freeBet,
	Rebate_and_cashback: [defPromotionType.rebate, defPromotionType.cashback]
};

const defPromoNavs = [
	{
		displayKey: "lbl_All",
		value: defFilterType.all,
		className: "blueBorder"
	},
	{
		displayKey: "PromotionCategory1",
		value: defFilterType.firstDeposit,
		className: "blueBorder"
	},
	{
		displayKey: "lbl_FreeBet",
		value: defFilterType.freeBet,
		className: "blueBorder"
	},
	{
		displayKey: "lbl_PromotionRebateAndCashback",
		value: defFilterType.Rebate_and_cashback,
		className: "blueBorder"
	},
	{
		displayKey: "lbl_Redeposit_Promo",
		value: defFilterType.redeposit,
		className: "blueBorder"
	},

	{
		displayKey: "lbl_Expired",
		value: defFilterType.expiry,
		className: "orange",
		selectedClass: "red"
	}
];

export default ({ t, onClick, selected }) => {
	let rows = defPromoNavs.map(p => {
		return (
			<button
				key={`promo-nav-${p.displayKey}`}
				className={
					p.value === selected
						? p.selectedClass
							? p.selectedClass
							: "btn-check"
						: p.className
				}
				onClick={onClick.bind(this, p.value)}>
				{t(p.displayKey)}
			</button>
		);
	});
	return (
		<div className="quickSelect">
			<div className="btnGroup promoType">{rows}</div>
		</div>
	);
};
