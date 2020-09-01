import React from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import LeftMenu from "../components/common/leftMenu";
import Withdrawal from "../components/withdrawal/withdrawal.set.bank";
import WithdrawalWrapper from "../components/withdrawal/wrapper";
import RecentHistory from "../components/withdrawal/recentHistory";
import path from "../path";
import { Link } from "@reach/router";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section className="inside">
						<LeftMenu />
						<div className="rightModule">
							<WithdrawalWrapper step={1}>
								<Withdrawal />
							</WithdrawalWrapper>
							<RecentHistory />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};
