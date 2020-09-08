import React, { useContext, useState, useEffect, useRef } from "react";
import { popBoxContext, userInfoContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { defPopBoxType } from "../common/popBox";
import { api_accountStrict_VerifyPhone } from "../../service/api/accountStrict";

export default ({ request_id }) => {
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const isMountedRef = useRef(null);
	const { t } = useTranslation();

	const [code, setCode] = useState("");
	const [verifyPhoneError, setVerifyPhoneError] = useState("");
	const [verifyPhoneloading, setVerifyPhoneloading] = useState(false);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

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

	const verifyPone = async () => {
		if (!code) return;

		setVerifyPhoneloading(true);
		setCode("");
		setVerifyPhoneError("");

		try {
			const {
				data: { errorCode, message }
			} = await api_accountStrict_VerifyPhone({ request_id, code });
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
			<div className="txt-lightgray">
				We have sent the verification code to your registered mobile.
				<br />
				Please enter the verification number you received below.
			</div>
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
				<button onClick={clickClose} className="btn-check">
					Retransmit
				</button>
			</div>
		</div>
	);
};
