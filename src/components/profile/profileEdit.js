import React from "react";
import moment from "moment";
import Inputbox from "../common/inputbox";
import { useTranslation } from "react-i18next";
import DateTime from "react-datetime";

export default props => {
	const { t } = useTranslation();

	let legalDate = moment().subtract(21, "year");

	const valid = current => {
		return current.isBefore(legalDate);
	};

	return (
		<div className="editModule">
			{!props.userInfo.accountName ? (
				<Inputbox
					title={t("lbl_RealName")}
					checkIcon="icon icon-error"
					onChange={props.onChangeName}
					value={props.nameValue}
					onBlur={props.checkName}
				/>
			) : null}

			{props.nameErr ? (
				<div className="tip active">{props.nameErr}</div>
			) : null}

			{!props.userInfo.birth_d ? (
				<div className="inputBox">
					<i className="txt-blue12">{t("lbl_Birthday")}</i>
					<DateTime
						value={props.birthValue}
						onChange={props.onChangeBirth}
						timeFormat={false}
						dateFormat={"YYYY-MM-DD"}
						onBlur={props.checkBirth}
						defaultValue={legalDate}
						isValidDate={valid}
					/>
				</div>
			) : null}

			{props.birthErr ? (
				<div className="tip active">{props.birthErr}</div>
			) : null}

			{!props.userInfo.phoneNo ? (
				<Inputbox
					title={t("lbl_Phone")}
					checkIcon="icon icon-error"
					onChange={props.onChangePhone}
					value={props.phoneValue}
					onBlur={props.checkPhone}
				/>
			) : null}

			{props.phoneErr ? (
				<div className="tip active">{props.phoneErr}</div>
			) : null}

			<div className="btnGroup">
				<button className="btn-check" onClick={props.submitProfile}>
					{t("lbl_Submit")}
				</button>
			</div>
		</div>
	);
};
