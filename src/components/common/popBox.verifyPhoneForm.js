import React, { useContext, useState, useEffect, useRef } from "react";
import { popBoxContext, userInfoContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { defPopBoxType } from "../common/popBox";
import {
	api_accountStrict_VerifyPhone,
	api_accountStrict_SendVerifySMS
} from "../../service/api/accountStrict";

export default ({ request_id }) => {
	const { userInfo, setUserInfo } = useContext(userInfoContext);
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

	const MobileVerificationLoading = () => {
		return (
			<div className="otpLoading">
				<i className="icon icon-spinner11"></i>
			</div>
		);
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

	const sendVerifySMS = async () => {
		setMobileVerificationLoading(true);
		try {
			const {
				data: { errorCode, message }
			} = await api_accountStrict_SendVerifySMS();
			if (isMountedRef.current) {
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
		} catch (e) {
			clickClose();
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.ErrorMsg,
				message: t("msg_ApiServerError"),
				btnBar: (
					<div className="btnGroup">
						<button className="btn-cancel" onClick={clickClose}>
							{t("lbl_Close")}
						</button>
					</div>
				)
			});
			setMobileVerificationLoading(false);
		}
	};

	const verifyPone = async () => {
		if (!code) return;

		setVerifyPhoneloading(true);
		setCode("");
		setVerifyPhoneError("");
		console.log(requestId, code);
		try {
			const {
				data: { errorCode, message }
			} = await api_accountStrict_VerifyPhone({
				request_id: requestId,
				code
			});
			if (isMountedRef.current) {
				setVerifyPhoneloading(false);
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
		} catch (e) {
			if (isMountedRef.current) {
				setVerifyPhoneloading(false);
				clickClose();
				setPopBox({
					isOpen: true,
					popBoxType: defPopBoxType.ErrorMsg,
					message: t("msg_ApiServerError"),
					btnBar: (
						<div className="btnGroup">
							<button className="btn-cancel" onClick={clickClose}>
								{t("lbl_Close")}
							</button>
						</div>
					)
				});
			}
		}
	};

	return (
		<div className="editSuccess active" style={{ display: "flex" }}>
			{/* <!--輸入OTP--> */}
			<div className="icon icon-icon32px_notification"></div>
			<div className="title">Important Note</div>
			<div className="txt-lightgray">{t("msg_OTPSendCode")}</div>
			<div className="inputModuleRow">
				<div className="inputBox">
					<input
						value={code}
						onChange={e => setCode(e.target.value)}
					/>
				</div>
				<div className="btnGroup otpBtn">
					{verifyPhoneloading ? (
						<div style={{ minWidth: "128px" }}>
							<MobileVerificationLoading />
						</div>
					) : (
						<button onClick={verifyPone} className="btn-check">
							Submit
						</button>
					)}
				</div>
			</div>

			{verifyPhoneError ? (
				<div className="tip active">{verifyPhoneError}</div>
			) : null}

			<div className="btnGroup">
				<button className="btn-cancel" onClick={clickClose}>
					{t("lbl_Close")}
				</button>

				{mobileVerificationLoading ? (
					<div style={{ minWidth: "128px" }}>
						<MobileVerificationLoading />
					</div>
				) : (
					<button
						disabled={retransmitSeconds > 0}
						className="btn-check"
						onClick={sendVerifySMS}>
						{retransmitSeconds <= 0
							? "Retransmit"
							: retransmitSeconds}
					</button>
				)}
			</div>
		</div>
	);
};
