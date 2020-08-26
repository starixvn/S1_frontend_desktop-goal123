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

	const dataList = [
		{
			label: t("lbl_RealName"),
			value: props.userInfo.accountName ? props.userInfo.accountName : "",
			format: "normal",
			show: props.userInfo.accountName ? true : false
		},
		{
			label: t("lbl_Phone"),
			value: props.userInfo.phoneNo
				? "(" + props.userInfo.AreaCode + ")" + props.userInfo.phoneNo
				: "",
			format: "phone",
			show: props.userInfo.phoneNo ? true : false
		},
		{
			label: t("lbl_Country"),
			value: props.userInfo.country ? props.userInfo.country : "",
			format: "normal",
			show: true
		},
		{
			label: t("lbl_RegisterTime"),
			value: props.userInfo
				? moment(props.userInfo.regTime).format("lll")
				: "",
			format: "normal",
			show: true
		},
		{
			label: t("lbl_LastLogin"),
			value: props.userInfo
				? moment(props.userInfo.lastLogin).format("lll")
				: "",
			format: "normal",
			show: true
		}
	];

	const layout = dataList?.map(item => {
		return (
			<>
				{item.show ? (
					<div>
						<div>{item.label}</div>
						<div>
							{item.value}
							{item.format === "phone" &&
							props.userInfo.phoneNo ? (
								<button className="icon icon-mobile otp"></button>
							) : (
								""
							)}
						</div>
					</div>
				) : (
					<></>
				)}
			</>
		);
	});

	return (
		<>
			<div className="profile">{layout}</div>
			<div className="editModule">
				{props.nameInputShow ? (
					<Inputbox
						title={t("lbl_RealName")}
						checkIcon="icon icon-error"
						onChange={props.onChangeName}
						value={props.nameValue}
						onBlur={props.checkName}
					/>
				) : (
					<></>
				)}
				{props.nameErr ? (
					<div className="tip active">{props.nameErr}</div>
				) : (
					<></>
				)}

				{props.birthInputShow ? (
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
				) : (
					<></>
				)}

				{props.birthErr ? (
					<div className="tip active">{props.birthErr}</div>
				) : (
					<></>
				)}

				{props.phoneInputShow ? (
					<Inputbox
						title={t("lbl_Phone")}
						checkIcon="icon icon-error"
						onChange={props.onChangePhone}
						value={props.phoneValue}
						onBlur={props.checkPhone}
					/>
				) : (
					<></>
				)}

				{props.phoneErr ? (
					<div className="tip active">{props.phoneErr}</div>
				) : (
					<></>
				)}

				<div className="btnGroup">
					<button className="btn-check" onClick={props.submitProfile}>
						{t("lbl_Submit")}
					</button>
				</div>
			</div>
		</>
	);
};
