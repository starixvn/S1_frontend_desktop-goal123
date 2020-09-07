import React, { useContext } from "react";
import { popBoxContext } from "../common/context";

export default () => {
	const { setPopBox } = useContext(popBoxContext);

	const clickClose = () => {
		setPopBox({ isOpen: false });
	};

	return (
		<div className="editSuccess active" style={{ display: "flex" }}>
			{/* <!--OTP提醒--> */}
			{/* <div className="editSuccess">
				<div className="icon icon-icon32px_notification"></div>
				<div className="title">Important Note</div>
				<div className="txt-lightgray">
					Do you want to enjoy our complete games and services through
					OTP certification immediately?
				</div>
				<div className="otpLoading">
					<i className="icon icon-spinner11"></i>
				</div>
				<div class="btnGroup">
					<button className="btn-cancel">Cancel</button>
					<button className="btn-check">Go Now !</button>
				</div>
			</div> */}
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
					<input />
				</div>
				<div className="btnGroup otpBtn">
					<button className="btn-check">Submit</button>
				</div>
			</div>
			<div className="tip active">
				Preferred currency can not be changed after registration.
			</div>
			<div className="btnGroup">
				<button onClick={clickClose} className="btn-check">
					Retransmit
				</button>
			</div>
		</div>
	);
};
