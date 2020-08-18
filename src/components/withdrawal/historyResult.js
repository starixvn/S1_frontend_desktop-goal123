import React from "react";
import moment from "moment";
import { number_format } from "../common/common";

const statusClassName = {
	1: "pending",
	2: "paid",
	3: "approved",
	4: "reject",
	5: "cancel"
};

export const TransactionHistory = props => {
	return (
		<div>
			<div>{props.idx}</div>
			<div>
				{moment(props.createTime).format("MM/DD/YYYY")}
				<span className="txt-blue2">
					{moment(props.createTime).format("hh:mm:ss A")}
				</span>
			</div>
			<div>{props.transId}</div>
			<div>{number_format(props.amount, props._isConvert)}</div>
			<div className={statusClassName[props.status]}>
				{props.i18n(`lbl_DepositStatus${props.status}`)}
			</div>
		</div>
	);
};
