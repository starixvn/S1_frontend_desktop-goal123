import React from "react";
import { useTranslation } from "react-i18next";
import AddBankAccount from "./addBankAccount";

export default () => {
	const { t } = useTranslation();

	return (
		<>
			<div className="walletModule">
				<div className="walletBalanceModule">
					<span className="icon icon-balance">
						{t("lbl_EligibleWithdrawalAmount")}
					</span>
					<span>3000000000('000)</span>
					<i className="icon icon-spinner11"></i>
				</div>
			</div>
			<div className="walletModule">
				<AddBankAccount />
				<div className="subModuleList">
					<div className="subModule">
						<div className="subModuleBody">
							<div className="calculation">
								<div>
									<div>Balance</div>
									<div>
										MYR <span>8,790</span>('000')
									</div>
								</div>
								<div>-</div>
								<div>
									<div>Offset rollover difference amount</div>
									<div>
										MYR <span>8,790</span>('000')
									</div>
								</div>
								<div>=</div>
								<div>
									<div>Your eligible Withdrawal amount</div>
									<div>
										MYR <span>300</span>('000')
									</div>
								</div>
							</div>
							<div className="cashBar">
								<div
									className="cashLine"
									style={{ width: "0%" }}>
									<div className="cashPoint">
										<span>$0</span>
									</div>
								</div>
							</div>
							<div className="inputModuleRow">
								<div className="inputBox">
									<i className="txt-blue12">Amount</i>
									<input />
									<div className="iconModule">
										<i className="">('000)</i>
										<i className="icon icon-information-solid"></i>
									</div>
								</div>
								<div className="btnGroup">
									<button className="btn-check">
										Submit
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
