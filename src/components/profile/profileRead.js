import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

export default props => {
	const { t } = useTranslation();
	const dataList = [
		{
			label: t("lbl_RealName"),
			value: props.userInfo.accountName,
			format: "normal"
		},
		{ label: t("lbl_Birthday"), value: props.birth, format: "normal" },
		{
			label: t("lbl_Phone"),
			value: props.userInfo.AreaCode + props.userInfo.phoneNo,
			format: "phone"
		},
		{
			label: t("lbl_Username"),
			value: props.userInfo.userName,
			format: "normal"
		},
		{
			label: t("lbl_Country"),
			value: props.userInfo.country,
			format: "normal"
		},
		{
			label: t("lbl_Email"),
			value: props.userInfo.email,
			format: "normal"
		},
		{
			label: t("lbl_RegisterTime"),
			value: moment(props.userInfo.regTime).format("lll"),
			format: "normal"
		},
		{
			label: t("lbl_LastLogin"),
			value: moment(props.userInfo.lastLogin).format("lll"),
			format: "normal"
		}
	];

	const layout = dataList?.map(item => {
		return (
			<div>
				<div>{item.label}</div>
				<div>
					{item.value}
					{item.format === "phone" ? (
						<button className="icon icon-mobile otp"></button>
					) : (
						""
					)}
				</div>
			</div>
		);
	});

	return <>{layout}</>;
};
