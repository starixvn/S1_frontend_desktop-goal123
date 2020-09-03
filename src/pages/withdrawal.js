import React, { useState } from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import LeftMenu from "../components/common/leftMenu";
import Withdrawal from "../components/withdrawal/withdrawal.set.bank";
import WithdrawalWrapper from "../components/withdrawal/wrapper";
import RecentHistory from "../components/withdrawal/recentHistory";

export default () => {
	const [shouldRefresh, setShouldRefresh] = useState(false);

	const refreshHitory = value => {
		if (value === "refresh") {
			setShouldRefresh(true);
		}
	};

	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section className="inside">
						<LeftMenu />
						<div className="rightModule">
							<WithdrawalWrapper step={1}>
								<Withdrawal refreshHitory={refreshHitory} />
							</WithdrawalWrapper>
							<RecentHistory shouldRefresh={shouldRefresh} />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};
