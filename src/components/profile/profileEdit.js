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
					onChange={props.onChangeName}
					value={props.nameValue}
					onBlur={props.checkName}
					clickInfo={props.clickInfo.bind(this, "accountName")}
					checked={props.status.accountName.checked}
					tip={props.status.accountName.tip}
				/>
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
						viewDate={moment(legalDate).format("YYYY-MM-DD")}
						isValidDate={valid}
					/>
					<i className="icon icon-calendar"></i>
				</div>
			) : null}

			{props.status.birth.tip ? (
				<div className="tip active">{props.status.birth.tip}</div>
			) : null}

			{!props.userInfo.phoneNo ? (
				<Inputbox
					title={t("lbl_Phone")}
					onChange={props.onChangePhone}
					value={props.phoneValue}
					onBlur={props.checkPhone}
					clickInfo={props.clickInfo.bind(this, "phoneNo")}
					checked={props.status.phoneNo.checked}
					tip={props.status.phoneNo.tip}
					areaCode={props.userInfo.AreaCode}
				/>
			) : null}

			{!props.userInfo.email ? (
				<Inputbox
					title={t("lbl_Email")}
					onChange={props.onChangeEmail}
					value={props.emailValue}
					onBlur={props.checkEmail}
					name="email"
					clickInfo={props.clickInfo.bind(this, "email")}
					checked={props.status.email.checked}
					tip={props.status.email.tip}
				/>
			) : null}

			<div className="btnGroup">
				<button className="btn-check" onClick={props.submitCheck}>
					{t("lbl_Submit")}
				</button>
			</div>
		</div>
	);
};
