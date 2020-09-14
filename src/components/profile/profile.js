import React, { useContext, useState, useEffect, useRef } from "react";
import { api_site_ExistsEmail } from "../../service/api/site";
import { api_account_ExistsPhone } from "../../service/api/account";
import {
	api_accountStrict_SetProfile,
	api_accountStrict_SendVerifySMS
} from "../../service/api/accountStrict";
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
import Loading from "../common/loading";

const initStatus = {
	accountName: {
		checked: null,
		tip: ""
	},
	birth: {
		checked: null,
		tip: ""
	},
	phoneNo: {
		checked: null,
		tip: ""
	},
	email: {
		checked: null,
		tip: ""
	}
};

export default () => {
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const { t } = useTranslation();
	const isMountedRef = useRef(null);
	const { setPopBox } = useContext(popBoxContext);
	const [redirectPath, setRedirectPath] = useState(null);
	const [loading, setLoading] = useState(false);
	const [mobileVerificationLoading, setMobileVerificationLoading] = useState(
		false
	);

	const [nameValue, setNameValue] = useState("");
	const [birthValue, setBirthValue] = useState("");
	const [phoneValue, setPhoneValue] = useState("");
	const [emailValue, setEmailValue] = useState("");
	const [status, setStatus] = useState(initStatus);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		setLoading(true);
		if (userInfo.isLogin && userInfo.currencyId) {
			getAreaCode();
			setLoading(false);
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
		let regex = /^(\(?\+?[0-9]*\?)?[0-9_]*$/;
		if (!(regex.test(value) || value === "")) {
			return false;
		} else {
			setPhoneValue(value);
		}
	};

	const onChangeEmail = e => {
		let value = e.target.value;
		setEmailValue(value);
	};

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const checkName = () => {
		let checkResult = false;
		let checkTip = "";

		if (userInfo.accountName) {
			checkResult = true;
		} else if (!userInfo.accountName && nameValue === "") {
			checkResult = false;
			checkTip = t("lbl_NameRequired");
		} else if (!userInfo.accountName && nameValue !== "") {
			checkResult = true;
			checkTip = "";
		}

		setStatus(prev => ({
			...prev,
			accountName: {
				tip: checkTip,
				checked: checkResult
			}
		}));

		return checkResult;
	};

	const checkBirth = () => {
		let checkResult = false;
		let checkTip = "";

		if (userInfo.birth_d) {
			checkResult = true;
		} else if (!userInfo.birth_d && birthValue === "") {
			checkResult = false;
			checkTip = t("lbl_BirthRequired");
		} else if (!userInfo.birth_d && birthValue !== "") {
			checkResult = true;
			checkTip = "";
		}

		setStatus(prev => ({
			...prev,
			birth: {
				tip: checkTip,
				checked: checkResult
			}
		}));
		return checkResult;
	};

	const checkPhoneIsUnique = async () => {
		try {
			if (!userInfo.phoneNo && phoneValue && phoneValue.length > 0) {
				const { data } = await api_account_ExistsPhone({
					AreaCode: userInfo.AreaCode,
					Phone: phoneValue
				});

				if (isMountedRef.current) {
					if (data.errorCode === 0) {
						if (data.data) {
							setStatus(prev => ({
								...prev,
								phoneNo: {
									tip: t("msg_PhoneExisted"),
									checked: false
								}
							}));
							return false;
						} else {
							setStatus(prev => ({
								...prev,
								phoneNo: {
									tip: "",
									checked: true
								}
							}));
							return true;
						}
					}
				}
			}
		} catch (e) {
			if (isMountedRef.current) {
				setPopBox({
					isOpen: true,
					popBoxType: defPopBoxType.ErrorMsg,
					message: t("msg_ApiServerError"),
					btnBar: (
						<div className="btnGroup">
							<button className="btn-cancel" onClick={ClickClose}>
								{t("lbl_Close")}
							</button>
						</div>
					)
				});
			}
		}
	};

	const checkPhone = async () => {
		let checkResult = false;

		if (userInfo.phoneNo) {
			checkResult = true;
		}

		if (!userInfo.phoneNo && phoneValue.length < 0) {
			setStatus(prev => ({
				...prev,
				phoneNo: {
					tip: t("lbl_PhoneRequired"),
					checked: false
				}
			}));
		} else if (
			!userInfo.phoneNo &&
			phoneValue !== "" &&
			phoneValue.length > 0
		) {
			setStatus(prev => ({
				...prev,
				phoneNo: {
					tip: "",
					checked: "loading"
				}
			}));

			checkResult = await checkPhoneIsUnique();
		}

		return checkResult;
	};

	const checkEmailIsUnique = async () => {
		try {
			if (!userInfo.email && emailValue && emailValue.length > 0) {
				const { data } = await api_site_ExistsEmail({
					Email: emailValue
				});

				if (isMountedRef.current) {
					if (data.errorCode === 0) {
						if (data.data === true) {
							setStatus(prev => ({
								...prev,
								email: {
									tip: t("msg_MailExisted"),
									checked: false
								}
							}));
							return false;
						} else if (data.data === false) {
							setStatus(prev => ({
								...prev,
								email: {
									tip: "",
									checked: true
								}
							}));
							return true;
						}
					}
				}
			}
		} catch (e) {
			if (isMountedRef.current) {
				setPopBox({
					isOpen: true,
					popBoxType: defPopBoxType.ErrorMsg,
					message: t("msg_ApiServerError"),
					btnBar: (
						<div className="btnGroup">
							<button className="btn-cancel" onClick={ClickClose}>
								{t("lbl_Close")}
							</button>
						</div>
					)
				});
			}
		}
	};

	const checkEmail = async () => {
		let checkResult = false;

		let checkTip = "";
		let emailRegex = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

		if (userInfo.email) {
			checkResult = true;
		}

		if (!userInfo.email && emailValue === "") {
			checkResult = false;
			checkTip = t("lbl_EmailRequired");
			setStatus(prev => ({
				...prev,
				email: {
					tip: checkTip,
					checked: checkResult
				}
			}));
		} else if (
			!userInfo.email &&
			emailValue.length > 0 &&
			!emailRegex.test(emailValue)
		) {
			checkResult = false;
			checkTip = t("lbl_EmailFormatError");
			setStatus(prev => ({
				...prev,
				email: {
					tip: checkTip,
					checked: checkResult
				}
			}));
		} else if (
			!userInfo.email &&
			emailValue.length > 0 &&
			emailRegex.test(emailValue)
		) {
			setStatus(prev => ({
				...prev,
				email: {
					tip: "",
					checked: "loading"
				}
			}));

			checkResult = await checkEmailIsUnique();
		}

		return checkResult;
	};

	const submitCheck = async () => {
		Promise.all([checkEmail(), checkPhone()]).then(res => {
			if (
				checkName() === true &&
				checkBirth() === true &&
				res[0] === true &&
				res[1] === true
			) {
				if (!userInfo.accountName) {
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ProfileConfirmCheck,
						accountName: nameValue,
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={ClickClose}>
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
		});
	};

	const clickInfo = col => {
		if (col === "accountName") {
			setStatus(prev => ({
				...prev,
				accountName: {
					tip: t("lbl_RemindForName"),
					checked: null
				}
			}));
		} else if (col === "phoneNo") {
			setStatus(prev => ({
				...prev,
				phoneNo: {
					tip: t("lbl_PhoneTooltip"),
					checked: null
				}
			}));
		} else if (col === "email") {
			setStatus(prev => ({
				...prev,
				email: {
					tip: t("lbl_EmailToolTip"),
					checked: null
				}
			}));
		}
	};

	const submitProfile = () => {
		setLoading(true);
		const ClickClose = () => {
			setPopBox({ isOpen: false });
		};

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
			PhoneNo: !userInfo.phoneNo ? phoneValue : userInfo.phoneNo,
			Email: !userInfo.email ? emailValue : userInfo.email
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setUserInfo(prev => ({
							...prev,
							accountName: !userInfo.accountName
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
							phoneNo: phoneValue,
							email: !userInfo.email ? emailValue : userInfo.email
						}));
						setNameValue("");
						setBirthValue("");
						setPhoneValue("");
						setEmailValue("");
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
					setLoading(false);
				}
			},
			err => {
				if (isMountedRef.current) {
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={ClickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
					setLoading(false);
				}
			}
		);
	};

	const sendVerifySMS = () => {
		setMobileVerificationLoading(true);

		api_accountStrict_SendVerifySMS().then(
			res => {
				if (isMountedRef.current) {
					const {
						data: { errorCode, message }
					} = res;
					const success = errorCode === 0;
					if (success) {
						setPopBox({
							isOpen: true,
							request_id: message,
							popBoxType: defPopBoxType.VerifyPhoneForm
						});
					} else {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: message || "error",
							icon: "icon-bell",
							errorCode,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
					setMobileVerificationLoading(false);
				}
			},
			err => {
				if (isMountedRef.current) {
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						icon: "icon-bell",
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={ClickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
					setMobileVerificationLoading(false);
				}
			}
		);
	};

	return loading ? (
		<Loading />
	) : redirectPath === null ? (
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_Profile">
				<span>{t("lbl_Profile")}</span>
				<div>{t("lbl_ProfileModifyWarning")}</div>
			</div>
			<div
				className={
					!userInfo.accountName ||
					!userInfo.birth_d ||
					!userInfo.email ||
					!userInfo.phoneNo
						? "profileEdit"
						: ""
				}>
				<ProfileRead
					userInfo={userInfo}
					sendVerifySMS={sendVerifySMS}
					mobileVerificationLoading={mobileVerificationLoading}
				/>

				{!userInfo.accountName ||
				!userInfo.birth_d ||
				!userInfo.phoneNo ||
				!userInfo.email ? (
					<ProfileEdit
						userInfo={userInfo}
						submitCheck={submitCheck}
						onChangeName={onChangeName}
						onChangeBirth={onChangeBirth}
						onChangePhone={onChangePhone}
						onChangeEmail={onChangeEmail}
						nameValue={nameValue}
						birthValue={birthValue}
						phoneValue={phoneValue}
						emailValue={emailValue}
						checkName={checkName}
						checkBirth={checkBirth}
						checkPhone={checkPhone}
						checkEmail={checkEmail}
						clickInfo={clickInfo.bind(this)}
						checked={status.checked}
						col={status.col}
						tip={status.tip}
						status={status}
					/>
				) : null}
			</div>
		</div>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
