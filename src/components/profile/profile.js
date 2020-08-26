import React, {
	useContext,
	useState,
	useEffect,
	useRef,
	Children
} from "react";
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

	const [nameInputShow, setNameInputShow] = useState(false);
	const [birthInputShow, setBirthInputShow] = useState(false);
	const [phoneInputShow, setPhoneInputShow] = useState(false);

	const [nameErr, setNameErr] = useState("");
	const [birthErr, setBirthErr] = useState("");
	const [phoneErr, setPhoneErr] = useState("");

	const [namePass, setNamePass] = useState(false);
	const [birthPass, setBirthPass] = useState(false);
	const [phonePass, setPhonePass] = useState(false);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (Object.keys(userInfo).length > 3) {
			getColumnShowStatus();
		}
	}, [userInfo]);

	useEffect(() => {
		if (Object.keys(userInfo).length > 3) {
			getAreaCode();
		}
	}, [userInfo.country]);

	const getColumnShowStatus = () => {
		if (!userInfo.accountName) {
			setNameInputShow(true);
		}
		if (!userInfo.birth_d) {
			setBirthInputShow(true);
		}
		if (!userInfo.phoneNo) {
			setPhoneInputShow(true);
		}
	};

	let monthName = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	];

	const monthShortName = monthName[userInfo.birth_m - 1];
	const birth =
		monthShortName + " / " + userInfo.birth_d + " / " + userInfo.birth_y;

	const getAreaCode = () => {
		if (
			userInfo.country === undefined ||
			userInfo.country === null ||
			userInfo.country === ""
		) {
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

	const linkToDeposit = () => {
		setRedirectPath(`/${userInfo.langId}/${path.deposit.root}`);
	};

	const checkName = () => {
		if (!nameInputShow) {
			setNamePass(true);
		} else if (nameInputShow && nameValue === "") {
			setNameErr(t("lbl_NameRequired"));
		} else if (nameInputShow && nameValue !== "") {
			setNameErr("");
			setNamePass(true);
		}
	};

	const checkBirth = () => {
		let compareAge = moment().diff(
			moment(birthValue, "YYYY-MM-DD"),
			"years"
		);
		if (!birthInputShow) {
			setBirthPass(true);
		} else if (birthInputShow && birthValue === "") {
			setBirthErr(t("lbl_BirthRequired"));
		} else if (birthInputShow && compareAge < 21) {
			setBirthErr(t("lbl_Age21Warning"));
		} else if (birthInputShow && compareAge >= 21) {
			setBirthErr("");
			setBirthPass(true);
		}
	};

	const checkPhone = () => {
		if (!phoneInputShow) {
			setPhonePass(true);
		}
		if (phoneInputShow && phoneValue === "") {
			setPhoneErr(t("lbl_PhoneRequired"));
		} else if (phoneInputShow && phoneValue !== "") {
			setPhoneErr(t(""));
			setPhonePass(true);
		}
	};

	const submitCheck = () => {
		checkName();
		checkBirth();
		checkPhone();
		if (
			namePass &&
			birthPass &&
			phonePass &&
			nameErr === "" &&
			birthErr === "" &&
			phoneErr === ""
		) {
			if (nameInputShow) {
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
		api_accountStrict_SetProfile({
			AccountName: nameInputShow ? nameValue : userInfo.accountName,
			Birth_d: birthInputShow
				? birthValue.slice(8, 10)
				: userInfo.birth_d,
			Birth_m: birthInputShow ? birthValue.slice(5, 7) : userInfo.birth_m,
			Birth_y: birthInputShow ? birthValue.slice(0, 4) : userInfo.birth_y,
			CountryCode: userInfo.country,
			AreaCode: userInfo.AreaCode,
			PhoneNo: phoneInputShow ? phoneValue : userInfo.phoneNo
		}).then(
			res => {
				console.log(res.data);
				if (res.data.errorCode === 0) {
					if (isMountedRef.current) {
						setUserInfo(prev => ({
							...prev,
							accountName: nameInputShow
								? nameValue
								: userInfo.accountName,
							birth_d: birthInputShow
								? birthValue.slice(8, 10)
								: userInfo.birth_d,
							birth_m: birthInputShow
								? birthValue.slice(5, 7)
								: userInfo.birth_m,
							birth_y: birthInputShow
								? birthValue.slice(0, 4)
								: userInfo.birth_y,
							phoneNo: phoneValue
						}));
						setNameValue("");
						setBirthValue("");
						setPhoneValue("");
						setNameInputShow(false);
						setBirthInputShow(false);
						setPhoneInputShow(false);
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ProfileCompelete,
							refresh: true,
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
				} else {
					alert(res.data.message);
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
			{nameInputShow || birthInputShow || phoneInputShow ? (
				<div className="profileEdit">
					<ProfileEdit
						userInfo={userInfo}
						birth={birth}
						nameInputShow={nameInputShow}
						birthInputShow={birthInputShow}
						phoneInputShow={phoneInputShow}
						onChangeName={onChangeName}
						onChangeBirth={onChangeBirth}
						onChangePhone={onChangePhone}
						nameValue={nameValue}
						birthValue={birthValue}
						phoneValue={phoneValue}
						submitProfile={submitCheck}
						nameErr={nameErr}
						birthErr={birthErr}
						phoneErr={phoneErr}
						checkName={checkName}
						checkBirth={checkBirth}
						checkPhone={checkPhone}
					/>
				</div>
			) : (
				<div className="profile">
					<ProfileRead userInfo={userInfo} birth={birth} />
				</div>
			)}
		</div>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
