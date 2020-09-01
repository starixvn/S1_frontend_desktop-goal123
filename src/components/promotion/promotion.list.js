import React from "react";
import { Link } from "@reach/router";
import moment from "moment";
import path from "../../path";
import ProcessBar from "./promotion.processBar";
import { defFilterType } from "./promotion.nav";
import { promoStatus } from "./promotion.def";

const isNew = periodFrom => {
	return moment(moment.unix(periodFrom)).isAfter(
		new moment().add(-14, "days")
	);
};

export default ({ promoList, t, langId, currency, filter }) => {
	let rows = promoList?.map(p => {
		let _isNew =
			p.isJoin || p.status === promoStatus.running
				? false
				: isNew(p.periodFrom);
		return (
			<div
				key={`promotion.list-${p.bonusCode}-${p.categoryId}-${p.tpId}`}
				className={
					p.isJoin || p.status === promoStatus.running ? "active" : ""
				}>
				{filter === defFilterType.expiry ? (
					<div className="expiredIcon">EXPIRED</div>
				) : (
					<div className={_isNew ? "new" : ""}></div>
				)}
				<img src={p.banner} alt={p.title} />
				<div className="txt-darkBlue">{p.title}</div>
				<div className="txt-dark">Promotions Description</div>
				<div className="txt-gray">{p.description}</div>
				<PromoRule t={t} {...p} />
				<ProcessBar t={t} {...p} currency={currency} />
				<Link
					className="btnGroup"
					to={`/${langId}/${path.promotion.root}/${path.promotion.sub.promotionInfo.root}?BonusCode=${p.bonusCode}`}>
					<button className="blue">{t("lbl_Details")}</button>
				</Link>
			</div>
		);
	});

	return (
		<div
			className={`proList${
				filter === defFilterType.expiry ? " expired" : ""
			}`}>
			{rows}
		</div>
	);
};

const PromoRule = ({
	isJoin,
	status,
	periodTo,
	custExpiryTime,
	rollOver,
	t
}) => {
	let expiryTime = moment.duration(
		moment
			.unix(
				isJoin && status === promoStatus.running && custExpiryTime
					? custExpiryTime
					: periodTo
			)
			.diff(new Date())
	);

	let displayExpiryTime = `${expiryTime.days()} days ${expiryTime.hours()} hours`;

	return (
		<div className="rollover">
			<div>
				<div className="icon icon-icon32px_time">
					{t("lbl_RemainingTime")}
				</div>
				<div className="icon icon-icon32px_">{t("lbl_RollOver")}</div>
			</div>
			<div className="txt-orange">
				<div>{displayExpiryTime}</div>
				<div>{rollOver}X</div>
			</div>
		</div>
	);
};
