import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { popBoxContext } from "../components/common/context";
import { api_account_ChangePassword } from "../service/api/account";
import { defPopBoxType } from "../components/common/popBox";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import Inputbox from "../components/common/inputbox.password";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<Content />
				</main>
			</Layout>
		</Wrapper>
	);
};

const initPsw = {
	oldPsw: "",
	newPsw: ""
};

const initWarning = {
	oldPsw: { status: false, msg: "" },
	newPsw: { status: false, msg: "" }
};

const initShowPsw = {
	oldPsw: false,
	newPsw: false
};

const Content = () => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const [userPsw, setUserPsw] = useState(initPsw);
	const [warning, setWarning] = useState(initWarning);
	const [showPsw, setShowPsw] = useState(initShowPsw);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const pswCheck = val => {
		let checked = true;
		let message = "";

		const regx = /^[a-zA-Z0-9@$*!%#?&]*$/;
		if (val === "") {
			checked = false;
			message = t("msg_PasswordReq");
		} else if (val !== null) {
			if (val.length < 6 || val.length > 18) {
				checked = false;
				message = t("msg_PasswordLength");
			} else if (!regx.test(val)) {
				checked = false;
				message = t("msg_PasswordVaildate");
			}
		}

		return { checked, message };
	};

	const checkPswHandler = (col, e) => {
		let val = e.target.value;
		let result = pswCheck(val);

		setWarning(prev => ({
			...prev,
			[col]: { status: !result.checked, msg: result.message }
		}));
	};

	const editField = (col, e) => {
		let val = e.target.value;
		setUserPsw(prev => ({ ...prev, [col]: val }));
	};

	const showPswHandler = col => {
		let _showPsw = !showPsw[col];
		setShowPsw(prev => ({ ...prev, [col]: _showPsw }));
	};

	const clickSubmit = e => {
		e.preventDefault();
		let _oldPsw = pswCheck(userPsw.oldPsw);
		let _newPsw = pswCheck(userPsw.newPsw);

		const ClickClose = () => {
			setPopBox({ isOpen: false });
		};

		if (_oldPsw.checked && _newPsw.checked) {
			api_account_ChangePassword({
				OldPassword: userPsw.oldPsw,
				NewPassword: userPsw.newPsw
			}).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.ChangePsw,
								message: t("msg_Updatesuccessful"),
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
						} else {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.ChangePsw,
								message: res.data.message,
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
					}
				}
			);
		} else {
			setWarning({
				oldPsw: { status: !_oldPsw.checked, msg: _oldPsw.message },
				newPsw: { status: !_newPsw.checked, msg: _newPsw.message }
			});
		}
	};

	return (
		<section className="inside">
			<div id="leftMenu"></div>
			<div className="rightModule">
				<div className="infoModule">
					<div className="inside-title icon icon-icon32px_password">
						<span>{t("lbl_ChangePassword")}</span>
						<div>{t("lbl_ChangePasswordHint")}</div>
					</div>
					<form className="changePassWord" onSubmit={clickSubmit}>
						{/* <div className="lastChange">
							Last Change<span>JUN 10,2020 4:15 PM</span>
						</div> */}
						<Inputbox
							inputType={showPsw.oldPsw ? "text" : "password"}
							title={t("lbl_OldPassword")}
							value={userPsw.oldPsw}
							onChange={editField.bind(this, "oldPsw")}
							onBlur={checkPswHandler.bind(this, "oldPsw")}
							showPsw={showPsw.oldPsw}
							showPswHandler={showPswHandler.bind(this, "oldPsw")}
							warning={warning.oldPsw.status}
							tip={warning.oldPsw.msg}
						/>
						<Inputbox
							inputType={showPsw.newPsw ? "text" : "password"}
							title={t("lbl_NewPassword")}
							value={userPsw.newPsw}
							onChange={editField.bind(this, "newPsw")}
							onBlur={checkPswHandler.bind(this, "newPsw")}
							showPsw={showPsw.newPsw}
							showPswHandler={showPswHandler.bind(this, "newPsw")}
							warning={warning.newPsw.status}
							tip={warning.newPsw.msg}
						/>
						<div className="btnGroup">
							<button
								className="btn-check"
								type="submit"
								onClick={clickSubmit}>
								{t("lbl_Submit")}
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
};
