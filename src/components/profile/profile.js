import React, { useContext, useState, useEffect, useRef } from "react";
import { api_accountStrict_SetProfile } from "../../service/api/accountStrict";
import { useTranslation } from "react-i18next";
import areaCode from "../../datas/areaCode";
import ProfileRead from "./profileRead";
import ProfileEdit from "./profileEdit";
import moment from "moment";
import { defPopBoxType } from "../common/popBox";
import { popBoxContext, userInfoContext } from "../common/context";
import { getCountryCode } from "../common/common";
import path from "../../path";
import { Redirect } from "@reach/router";

export default () => {
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const { t } = useTranslation();
	const isMountedRef = useRef(null);
	const { setPopBox } = useContext(popBoxContext);
	const [redirectPath, setRedirectPath] = useState(null);

	const [nameValue, setNameValue] = useState("");
	const [birthValue, setBirthValue] = useState("");
	const [phoneValue, setPhoneValue] = useState("");

	const [nameErr, setNameErr] = useState("");
	const [birthErr, setBirthErr] = useState("");
	const [phoneErr, setPhoneErr] = useState("");

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (userInfo.regTime) {
			getAreaCode();
		}
	}, [userInfo.country]);

	const getAreaCode = () => {
		if (!userInfo.country) {
			let value_areaCode =
				areaCode[getCountryCode(userInfo.currencyId)].AreaCode;
			let value_country = getCountryCode(userInfo.currencyId);
			setUserInfo(prev => ({
				...prev,
				AreaCode: value_areaCode,
				country: value_country
			}));
		} else {
			let value_areaCode = areaCode[userInfo.country].AreaCode;
			setUserInfo(prev => ({
				...prev,
				AreaCode: value_areaCode
			}));
		}
	};

	const onChangeName = e => {
		let value = e.target.value;
		setNameValue(value);
	};

	const onChangeBirth = value => {
		let selectDate = moment(value).format("YYYY-MM-DD");
		setBirthValue(selectDate);
	};

	const onChangePhone = e => {
		let value = e.target.value;
		setPhoneValue(value);
	};

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const checkName = () => {
		let checkResult = false;
		if (userInfo.AccountName) {
			checkResult = true;
		} else if (!userInfo.AccountName && nameValue === "") {
			checkResult = false;
			setNameErr(t("lbl_NameRequired"));
		} else if (!userInfo.AccountName && nameValue !== "") {
			setNameErr("");
			checkResult = true;
		}
		return checkResult;
	};

	const checkBirth = () => {
		let checkResult = false;
		if (userInfo.birth_d) {
			checkResult = true;
		} else if (!userInfo.birth_d && birthValue === "") {
			checkResult = false;
			setBirthErr(t("lbl_BirthRequired"));
		} else if (!userInfo.birth_d && birthValue !== "") {
			checkResult = true;
			setBirthErr("");
		}
		return checkResult;
	};

	const checkPhone = () => {
		let checkResult = false;
		if (userInfo.phoneNo) {
			checkResult = true;
		}
		if (!userInfo.phoneNo && phoneValue === "") {
			checkResult = false;
			setPhoneErr(t("lbl_PhoneRequired"));
		} else if (!userInfo.phoneNo && phoneValue !== "") {
			checkResult = true;
			setPhoneErr("");
		}
		return checkResult;
	};

	const submitCheck = () => {
		if (
			checkName() === true &&
			checkBirth() === true &&
			checkPhone() === true
		) {
			if (!userInfo.AccountName) {
				setPopBox({
					isOpen: true,
					popBoxType: defPopBoxType.ProfileConfirmCheck,
					accountName: nameValue,
					btnBar: (
						<div className="btnGroup">
							<button className="btn-cancel" onClick={ClickClose}>
								{t("lbl_ReModify")}
							</button>
							<button
								className="btn-check"
								onClick={submitProfile}>
								{t("lbl_Confirm")}
							</button>
						</div>
					)
				});
			} else {
				submitProfile();
			}
		}
	};

	const submitProfile = () => {
		let linkToDeposit = () => {
			setRedirectPath(`/${userInfo.langId}/${path.deposit.root}`);
		};
		api_accountStrict_SetProfile({
			AccountName: !userInfo.accountName
				? nameValue
				: userInfo.accountName,
			Birth_d: !userInfo.birth_d
				? birthValue.slice(8, 10)
				: userInfo.birth_d,
			Birth_m: !userInfo.birth_d
				? birthValue.slice(5, 7)
				: userInfo.birth_m,
			Birth_y: !userInfo.birth_d
				? birthValue.slice(0, 4)
				: userInfo.birth_y,
			CountryCode: userInfo.country,
			AreaCode: userInfo.AreaCode,
			PhoneNo: !userInfo.phoneNo ? phoneValue : userInfo.phoneNo
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setUserInfo(prev => ({
							...prev,
							accountName: !userInfo.AccountName
								? nameValue
								: userInfo.accountName,
							birth_d: !userInfo.birth_d
								? birthValue.slice(8, 10)
								: userInfo.birth_d,
							birth_m: !userInfo.birth_d
								? birthValue.slice(5, 7)
								: userInfo.birth_m,
							birth_y: !userInfo.birth_d
								? birthValue.slice(0, 4)
								: userInfo.birth_y,
							phoneNo: phoneValue
						}));
						setNameValue("");
						setBirthValue("");
						setPhoneValue("");
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ProfileCompelete,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										{t("lbl_Later")}
									</button>
									<button
										className="btn-check"
										onClick={linkToDeposit}>
										{t("lbl_DepositNow")}
									</button>
								</div>
							)
						});
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					alert(t("msg_ApiServerError"));
				}
			}
		);
	};

	return redirectPath === null ? (
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_Profile">
				<span>{t("lbl_Profile")}</span>
				<div>{t("lbl_ProfileModifyWarning")}</div>
			</div>
			<div
				className={
					!userInfo.accountName ||
					!userInfo.birth_d ||
					!userInfo.phoneNo
						? "profileEdit"
						: ""
				}>
				<ProfileRead userInfo={userInfo} />
				{!userInfo.accountName ||
				!userInfo.birth_d ||
				!userInfo.phoneNo ? (
					<ProfileEdit
						userInfo={userInfo}
						submitProfile={submitCheck}
						onChangeName={onChangeName}
						onChangeBirth={onChangeBirth}
						onChangePhone={onChangePhone}
						nameValue={nameValue}
						birthValue={birthValue}
						phoneValue={phoneValue}
						nameErr={nameErr}
						birthErr={birthErr}
						phoneErr={phoneErr}
						checkName={checkName}
						checkBirth={checkBirth}
						checkPhone={checkPhone}
					/>
				) : null}
			</div>
		</div>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
