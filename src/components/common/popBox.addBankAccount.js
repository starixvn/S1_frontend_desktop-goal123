import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";

export default () => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);

	const ClickCancel = () => {
		setPopBox({ isOpen: false });
	};

	const ClickSubmit = () => {
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.AddBankSuccess,
			btnBar: (
				<div className="btnGroup">
					<button className="btn-check" onClick={ClickCancel}>
						OK
					</button>
				</div>
			)
		});
	};

	return (
		<div className="addBankpop active">
			<span className="title">Add Bank Account</span>
			<div className="txt-lightgray">
				Please upload your bank account details before making
				withdrawal.
			</div>
			<div className="txt">
				<div>
					<span className="txt-blue2">Account Name</span>
					<span>Zero chou</span>
				</div>
				<div className="iconModule">
					<i className="icon icon-information-solid"></i>
				</div>
			</div>
			<div className="inputBox">
				<div className="dropdown">
					<button className="btn">MYR</button>
					<div className="dropdown-container">
						<div className="dropdown-item">MYR</div>
						<div className="dropdown-item">THB</div>
						<div className="dropdown-item">RMB</div>
						<div className="dropdown-item">IDR</div>
						<div className="dropdown-item">VND</div>
					</div>
				</div>
			</div>
			<div className="inputBox">
				<i className="txt-lightgray">Account Number</i>
				<input />
				<div className="iconModule">
					<i className="icon icon-information-solid"></i>
				</div>
			</div>
			<div className="tip">
				6-18 alphanumeric (A-Z, a-z, 0-9)characters or special
				characters @$*!%#?&
			</div>
			<div className="btnGroup">
				<button className="btn-cancel" onClick={ClickCancel}>
					{t("lbl_Cancel")}
				</button>
				<button className="btn-check" onClick={ClickSubmit}>
					{t("lbl_Submit")}
				</button>
			</div>{" "}
		</div>
	);
};
