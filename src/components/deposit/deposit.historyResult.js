import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { number_format } from "../common/common";

const statusClassName = {
	1: "pending",
	2: "paid",
	3: "approved",
	4: "reject",
	5: "cancel"
};

export const TransactionHistory = props => {
	const { t } = useTranslation();

	let btnGroup = null;
	if (props.depositType === 3 && (props.status === 1 || props.status === 7)) {
		btnGroup = (
			<>
				<button
					className="btn-check icon icon-pencil"
					onClick={props.SubmitProof}>
					{t("lbl_SubmitProof")}
				</button>
				<button className="btn-cancel" onClick={props.ClickCancel}>
					{t("lbl_Cancel")}
				</button>
			</>
		);
	}

	return (
		<div>
			<div>{props.idx}</div>
			<div>
				{moment(props.createTime).format("DD/MM/YYYY")}
				<span className="txt-blue2">
					{moment(props.createTime).format("HH:mm:ss")}
				</span>
			</div>
			<div>{props.transId}</div>
			<div>{t(`lbl_DepositType${props.depositType}`)}</div>
			<div>{number_format(props.amount, false)}</div>
			<div className={statusClassName[props.status]}>
				{t(`lbl_DepositStatus${props.status}`)}
			</div>
			<div className="btnGroup">{btnGroup}</div>
		</div>
	);
};
