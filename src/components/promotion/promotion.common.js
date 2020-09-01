import moment from "moment";
import { promoStatus } from "./promotion.def";

export const isExpiry = ({
	periodTo,
	custExpiryTime,
	isLogin,
	status,
	isJoin
}) => {
	let bonusExpiry = false;
	if (isLogin && isJoin) {
		bonusExpiry =
			status === promoStatus.Expiry ||
			moment(moment.unix(custExpiryTime)).isBefore(new moment());
	}

	return moment(moment.unix(periodTo)).isBefore(new moment()) || bonusExpiry;
};
