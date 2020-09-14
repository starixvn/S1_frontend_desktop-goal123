import {
	api_account_UserLogin,
	api_account_UserLogout
} from "../service/api/account";
import { api_accountStrict_GetCustProfile } from "../service/api/accountStrict";
import { api_site_CheckSignIn } from "../service/api/site";
import { setCookie } from "../components/common/common";

const isBrowser = typeof window !== `undefined`;

export const LOGIN = async ({ userName, password, langId }) => {
	if (!isBrowser) return false;

	const result = await api_account_UserLogin(langId, {
		UserName: userName,
		Userpwd: password,
		isPersistent: true
	}).then(
		res => {
			let errMsg = res.data.message;
			let isLogin = false;
			let userData = {};
			if (res.data.errorCode === 0) {
				let userlangId = res.data.message.replace("/", "");

				const getCustInfo = async () => {
					const r = await api_accountStrict_GetCustProfile().then(
						res_custInfo => {
							let _loginUser = {
								userName: userName,
								langId: userlangId,
								isLogin: true
							};

							if (res_custInfo.data.errorCode === 0) {
								let data = res_custInfo.data.data;
								_loginUser = {
									..._loginUser,
									...data
								};
								setCookie("goalLangId", data.langId);
							}
							return {
								errorCode: 0,
								message: "",
								isLogin: true,
								userData: _loginUser
							};
						}
					);

					return r;
				};

				return getCustInfo();
			} else {
				return {
					errorCode: res.data.errorCode,
					message: errMsg,
					isLogin: isLogin,
					userData: userData
				};
			}
		},
		err => {
			return {
				errorCode: 999,
				message: "",
				isLogin: false,
				userData: {}
			};
		}
	);

	return result;
};

export const IS_LOGGED_IN = async () => {
	return await api_site_CheckSignIn().then(res => res.data.errorCode === 0);
};

export const LOGOUT = callback => {
	if (!isBrowser) return;
	api_account_UserLogout().then(
		res => {
			if (res.data.errorCode === 0) {
				callback();
			}
		},
		err => {
			if (err.response.status === 401) {
				callback();
			}
		}
	);
};
