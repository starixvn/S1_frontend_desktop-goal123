import React, { useContext } from "react";
import { popBoxContext } from "./context";
import Cancel from "./popBox.cancel";
import UploadBankSlip from "./popBox.uploadBankSlip";
import Success from "./popBox.success";
import ErrorMsg from "./popBox.errorMsg";
import Login from "./popBox.login";
import Join from "./popBox.join";
import AddBankAccount from "./popBox.addBankAccount";
import AddBankSuccess from "./popBox.addBankSuccess";
import TitleWithButton from "./popBox.titleWithButton";
import ProfileConfirmCheck from "./popBox.profileConfirmCheck";
import ProfileCompelete from "./popBox.profileCompelete";
import ChangePsw from "./popBox.changePsw";

export const defPopBoxType = {
	Cancel: "Cancel",
	UploadBankSlip: "UploadBankSlip",
	Success: "Success",
	ErrorMsg: "ErrorMsg",
	Login: "Login",
	Join: "Join",
	AddBankAccount: "AddBankAccount",
	AddBankSuccess: "AddBankSuccess",
	TitleWithButton: "TitleWithButton",
	ProfileConfirmCheck: "ProfileConfirmCheck",
	ProfileCompelete: "ProfileCompelete",
	ChangePsw: "ChangePsw"
};

export default () => {
	const { popBox } = useContext(popBoxContext);

	let content = null;
	switch (popBox.popBoxType) {
		case defPopBoxType.Cancel:
			content = <Cancel btnBar={popBox.btnBar} />;
			break;

		case defPopBoxType.UploadBankSlip:
			const { isOpen, ...restProps } = popBox;
			content = <UploadBankSlip {...restProps} />;
			break;

		case defPopBoxType.Success:
			content = <Success btnBar={popBox.btnBar} />;
			break;

		case defPopBoxType.ErrorMsg:
			content = (
				<ErrorMsg btnBar={popBox.btnBar} message={popBox.message} />
			);
			break;

		case defPopBoxType.Login:
			content = <Login />;
			break;

		case defPopBoxType.Join:
			content = <Join />;
			break;

		case defPopBoxType.AddBankAccount:
			content = <AddBankAccount />;
			break;

		case defPopBoxType.AddBankSuccess:
			content = <AddBankSuccess btnBar={popBox.btnBar} />;
			break;

		case defPopBoxType.TitleWithButton:
			content = (
				<TitleWithButton
					btnBar={popBox.btnBar}
					message={popBox.message}
				/>
			);
			break;

		case defPopBoxType.ProfileConfirmCheck:
			content = (
				<ProfileConfirmCheck
					btnBar={popBox.btnBar}
					accountName={popBox.accountName}
				/>
			);
			break;

		case defPopBoxType.ProfileCompelete:
			content = <ProfileCompelete btnBar={popBox.btnBar} />;
			break;
		case defPopBoxType.ChangePsw:
			content = (
				<ChangePsw btnBar={popBox.btnBar} message={popBox.message} />
			);

		case defPopBoxType.default:
			break;
	}

	return popBox.isOpen ? (
		<div id="popup" className="active">
			<div className="pop">{content}</div>
		</div>
	) : (
		<></>
	);
};
