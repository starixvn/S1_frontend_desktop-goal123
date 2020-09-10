import React, { useContext, useState, useEffect, useRef } from "react";
import { popBoxContext, userInfoContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { defPopBoxType } from "../common/popBox";
import {
	api_accountStrict_VerifyPhone,
	api_accountStrict_SendVerifySMS
} from "../../service/api/accountStrict";

export default ({ request_id }) => {
	const { setUserInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const isMountedRef = useRef(null);
	const { t } = useTranslation();

	const [code, setCode] = useState("");
	const [requestId, setRequestId] = useState(request_id);
	const [retransmitSeconds, setRetransmitSeconds] = useState(0);
	const [verifyPhoneError, setVerifyPhoneError] = useState("");
	const [verifyPhoneloading, setVerifyPhoneloading] = useState(false);
	const [mobileVerificationLoading, setMobileVerificationLoading] = useState(
		false
	);

	const timerRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		return () => {
			clearInterval(timerRef.current);
		};
	}, []);

	const onChanheCode = e => {
		setCode(e.target.value);
	};

	const clickClose = () => {
		setPopBox({ isOpen: false });
	};

	const startTimer = () => {
		const countDownSecond = 300;
		const startTime = Date.now();
		const countDownTimerID = setInterval(() => {
			// 計算剩餘秒數
			const pastSeconds = parseInt((Date.now() - startTime) / 1000);
			const remain = countDownSecond - pastSeconds;
			setRetransmitSeconds(remain < 0 ? 0 : remain);
			// 檢查是否結束
			if (remain <= 0) {
				clearInterval(countDownTimerID);
			}
		}, 1000);
		timerRef.current = countDownTimerID;
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
						startTimer();
						setRequestId(message);
					} else {
						clickClose();
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: message || "error",
							errorCode,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={clickClose}>
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
					clickClose();
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={clickClose}>
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

	const verifyPone = () => {
		if (!code) return setVerifyPhoneError(t("msg_EnterOTPCode"));

		setVerifyPhoneloading(true);
		setCode("");
		setVerifyPhoneError("");

		api_accountStrict_VerifyPhone({
			request_id: requestId,
			code
		}).then(
			res => {
				if (isMountedRef.current) {
					setVerifyPhoneloading(false);
					const {
						data: { errorCode, message }
					} = res;
					const success = errorCode === 0;
					if (success) {
						setUserInfo(prev => ({
							...prev,
							phoneVerified: true
						}));
						clickClose();
					} else {
						setVerifyPhoneError(message);
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					setVerifyPhoneloading(false);
					clickClose();
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={clickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			}
		);
	};

	return (
		<div className="editSuccess active" style={{ display: "flex" }}>
			{/* <!--輸入OTP--> */}
			<div className="icon icon-icon32px_notification"></div>
			<div className="title">{t("lbl_ImportantNote")}</div>
			<div className="txt-lightgray">{t("msg_OTPSendCode")}</div>
			<div className="inputModuleRow">
				<div className="inputBox">
					<input value={code} onChange={e => onChanheCode(e)} />
				</div>
				<div className="btnGroup otpBtn">
					{verifyPhoneloading ? (
						<MobileVerificationLoading />
					) : (
						<button onClick={verifyPone} className="btn-check">
							{t("lbl_Submit")}
						</button>
					)}
				</div>
			</div>

			<div className={`tip ${verifyPhoneError ? "active" : ""}`}>
				{verifyPhoneError}
			</div>

			<div className="btnGroup">
				<button className="btn-cancel" onClick={clickClose}>
					{t("lbl_Close")}
				</button>

				{mobileVerificationLoading ? (
					<MobileVerificationLoading />
				) : (
					<button
						disabled={retransmitSeconds > 0}
						className="btn-check"
						onClick={sendVerifySMS}>
						{retransmitSeconds <= 0
							? t("lbl_Retransmit")
							: retransmitSeconds}
					</button>
				)}
			</div>
		</div>
	);
};

const MobileVerificationLoading = () => {
	return (
		<div style={{ minWidth: "128px" }}>
			<div className="otpLoading">
				<i className="icon icon-spinner11"></i>
			</div>
		</div>
	);
};
