import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

export default props => {
	const { t } = useTranslation();

	let monthName = [
		t("lbl_Month1"),
		t("lbl_Month2"),
		t("lbl_Month3"),
		t("lbl_Month4"),
		t("lbl_Month5"),
		t("lbl_Month6"),
		t("lbl_Month7"),
		t("lbl_Month8"),
		t("lbl_Month9"),
		t("lbl_Month10"),
		t("lbl_Month11"),
		t("lbl_Month12)")
	];
	const monthShortName = monthName[props.userInfo.birth_m - 1];
	const birth =
		monthShortName +
		" / " +
		props.userInfo.birth_d +
		" / " +
		props.userInfo.birth_y;

	const dataList = [
		{
			label: t("lbl_RealName"),
			value: props.userInfo.accountName,
			format: "normal"
		},
		{ label: t("lbl_Birthday"), value: birth, format: "normal" },
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
			<div key={`profileRead-${item.label}`}>
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
