import { accountStrictRequest } from "./base";

export const api_accountStrict_GetCustProfile = () =>
	accountStrictRequest.post("/GetCustProfile");

export const api_accountStrict_SetProfile = ({
	AccountName,
	Birth_d,
	Birth_m,
	Birth_y,
	CountryCode,
	AreaCode,
	PhoneNo,
	Email
}) =>
	accountStrictRequest.post("/SetProfileV2", {
		AccountName,
		Birth_d,
		Birth_m,
		Birth_y,
		CountryCode,
		AreaCode,
		PhoneNo,
		Email
	});

export const api_accountStrict_SetAccountName = ({ name }) =>
	accountStrictRequest.post("/SetAccountName", {
		name
	});

export const api_accountStrict_SetCustBankInfo = ({
	AccountName,
	AccountNo,
	SysId
}) =>
	accountStrictRequest.post("/SetCustBankInfo", {
		AccountName,
		AccountNo,
		SysId
	});

export const api_accountStrict_DelCustBankInfo = ({
	AccountName,
	AccountNo,
	SysId
}) =>
	accountStrictRequest.post("/DelCustBankInfo", {
		AccountName,
		AccountNo,
		SysId
	});

export const api_accountStrict_ResetPassword = ({ NewPassword }) =>
	accountStrictRequest.post("/ResetPassword", {
		NewPassword
	});

export const api_accountStrict_UploadCustPhotoId = formData =>
	accountStrictRequest.post("/UploadCustPhotoId", formData, {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});

export const api_accountStrict_SendVerifySMS = () =>
	accountStrictRequest.post("/SendVerifySMS");

export const api_accountStrict_VerifyPhone = ({ request_id, code }) =>
	accountStrictRequest.post(
		"/VerifyPhone",
		{ request_id, code },
		{
			headers: {
				"Content-Type": "application/json"
			}
		}
	);
