export const defActionType = {
	TO_NEXT_STEP: "TO_NEXT_STEP",
	TO_LAST_STEP: "TO_LAST_STEP",
	GET_CUST_BANK_INFO: "GET_CUST_BANK_INFO",
	SET_BANKLIST: "SET_BANKLIST",
	SELECT_BANK: "SELECT_BANK",
	EDIT_ACCOUNT_NUMBER: "EDIT_ACCOUNT_NUMBER",
	EDIT_ACCOUNT_NAME: "EDIT_ACCOUNT_NAME",
	BACK_TO_INIT: "BACK_TO_INIT"
};

const defStepModule = {
	1: "InitPanel",
	2: "BankPanel",
	3: "AccountPanel"
};

export const defModule = {
	[defStepModule[1]]: "InitPanel",
	[defStepModule[2]]: "BankPanel",
	[defStepModule[3]]: "AccountPanel"
};

export const initState = {
	displayModule: defModule.InitPanel,
	step: 1
};

export function reducer(state, action) {
	let newStep = 1;

	switch (action.type) {
		case defActionType.TO_NEXT_STEP:
			newStep = state.step + 1;
			return {
				...state,
				step: newStep,
				displayModule: defStepModule[newStep]
			};

		case defActionType.TO_LAST_STEP:
			newStep = state.step - 1;
			return {
				...state,
				step: newStep,
				displayModule: defStepModule[newStep]
			};

		case defActionType.GET_CUST_BANK_INFO:
			return {
				...state,
				accountName: action.accountName,
				custBankList: action.custBankList
			};

		case defActionType.SET_BANKLIST:
			return {
				...state,
				bankList: action.bankList
			};

		case defActionType.SELECT_BANK:
			newStep = state.step + 1;
			return {
				...state,
				account: "",
				accountName: "",
				bankIdx: action.bankIdx,
				step: newStep,
				displayModule: defStepModule[newStep]
			};

		case defActionType.EDIT_ACCOUNT_NUMBER:
			return {
				...state,
				account: action.account
			};

		case defActionType.EDIT_ACCOUNT_NAME:
			return {
				...state,
				accountName: action.accountName
			};

		case defActionType.BACK_TO_INIT:
			newStep = 1;
			return {
				...state,
				step: newStep,
				displayModule: defStepModule[newStep]
			};

		default:
			console.log("this action type is not exists");
			return state;
	}
}
