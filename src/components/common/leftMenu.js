import React, { useContext } from "react";
import { Link } from "@reach/router";
import path from "../../path";
import { userInfoContext } from "../common/context";

export default () => {
	const { userInfo } = useContext(userInfoContext);
	return (
		<div id="leftMenu">
			<div className="menuModule">
				<button className="menuHeader">Cashier</button>
				<Link
					to={`/${userInfo.langId}/${path.deposit.root}`}
					className="menuSelect active">
					<span>Deposit</span>
				</Link>
				<Link
					to={`/${userInfo.langId}/${path.transferFunds.root}`}
					className="menuSelect">
					<span>Transfer Funds</span>
				</Link>
				<Link
					to={`/${userInfo.langId}/${path.withdrawal.root}`}
					className="menuSelect">
					<span>Withdrawal</span>
				</Link>
			</div>
			<div className="menuModule">
				<button className="menuHeader">History</button>
				<Link
					to={`/${userInfo.langId}/${path.depositHistory.root}`}
					className="menuSelect">
					<span>Deposit History</span>
				</Link>
				<Link
					to={`/${userInfo.langId}/${path.transferHistory.root}`}
					className="menuSelect">
					<span>Transfer History</span>
				</Link>
				<Link
					to={`/${userInfo.langId}/${path.withdrawalHistory.root}`}
					className="menuSelect">
					<span>Withdrawal History</span>
				</Link>
				<Link
					to={`/${userInfo.langId}/${path.statement.root}`}
					className="menuSelect">
					<span>Statement</span>
				</Link>
			</div>
			<div className="menuModule">
				<button className="menuHeader">My Account</button>
				<Link
					to={`/${userInfo.langId}/${path.changePassword.root}`}
					className="menuSelect">
					<span>Change Password</span>
				</Link>
				<Link
					to={`/${userInfo.langId}/${path.profile.root}`}
					className="menuSelect">
					<span>Profile</span>
				</Link>
				<Link
					to={`/${userInfo.langId}/${path.bankInfo.root}`}
					className="menuSelect">
					<span>Bank Info</span>
				</Link>
			</div>
			<div className="menuModule">
				<button className="menuHeader">Message</button>
				<Link
					to={`/${userInfo.langId}/${path.message.root}`}
					className="menuSelect">
					<span>Personal Message</span>
				</Link>
				<Link
					to={`/${userInfo.langId}/${path.announcement.root}`}
					className="menuSelect">
					<span>Announcement</span>
				</Link>
			</div>
		</div>
	);
};
