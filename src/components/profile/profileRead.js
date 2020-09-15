import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

export default props => {
	const { t } = useTranslation();
	const birth =
		props.userInfo.birth_d +
		"/" +
		props.userInfo.birth_m +
		"/" +
		props.userInfo.birth_y;

	const dataList = [
		{
			label: t("lbl_RealName"),
			value: props.userInfo.accountName,
			show: props.userInfo.accountName ? true : false
		},
		{
			label: t("lbl_Birthday"),
			value: birth,
			format: "normal",
			show: props.userInfo.birth_d ? true : false
		},
		{
			label: t("lbl_Phone"),
			value: "(" + props.userInfo.AreaCode + ")" + props.userInfo.phoneNo,
			format: "phone",
			show: props.userInfo.phoneNo ? true : false
		},
		{
			label: t("lbl_Username"),
			value: props.userInfo.userName,
			show: true
		},
		{
			label: t("lbl_Country"),
			value: props.userInfo.country,
			show: true
		},
		{
			label: t("lbl_Email"),
			value: props.userInfo.email,
			show: props.userInfo.email ? true : false
		},
		{
			label: t("lbl_RegisterTime"),
			value: moment(props.userInfo.regTime).format("DD/MM/YYYY HH:mm:ss"),
			show: true
		},
		{
			label: t("lbl_LastLogin"),
			value: moment(props.userInfo.lastLogin).format(
				"DD/MM/YYYY HH:mm:ss"
			),
			show: true
		}
	];

	const showColumn = dataList?.filter(item => item.show === true);

	const layout = showColumn?.map(item => {
		return (
			<div key={`profileRead-${item.label}`}>
				<div>{item.label}</div>
				<div>
					{item.value}
					{item.format === "phone" ? (
						props.mobileVerificationLoading ? (
							<div className="otpLoading">
								<i className="icon icon-spinner11"></i>
							</div>
						) : props.userInfo.phoneVerified ? (
							<span className="icon icon-checkmark"></span>
						) : (
							<button onClick={props.sendVerifySMS}>
								<span className="icon icon-error otp"></span>
								<span>{t("lbl_MobileVerifiy")}</span>
							</button>
						)
					) : null}
				</div>
			</div>
		);
	});

	return <div className="profile">{layout}</div>;
};
