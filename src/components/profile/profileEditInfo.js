import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

export default props => {
	const { t } = useTranslation();

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

	const showColumn = dataList.filter(item => item.show === true);

	const leftLayout = showColumn?.map(item => {
		
		return (
			<div key={`leftLayout-${item.label}`}>
				<div>{item.label}</div>
				<div>
					{item.value}
					{item.format === "phone" && props.userInfo.phoneNo ? (
						<button className="icon icon-mobile otp"></button>
					) : (
						""
					)}
				</div>
			</div>
		);
	});

	return <div className="profile">{leftLayout}</div>;
};
