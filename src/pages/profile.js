import React from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import Profile from "../components/profile/profile";
import LeftMenu from "../components/common/leftMenu";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section class="inside">
						<LeftMenu />
						<div class="rightModule">
							<Profile />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};
