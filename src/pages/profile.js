import React from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import Profile from "../components/profile/profile";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section class="inside">
						<div id="leftMenu"></div>
						<div class="rightModule">
							<Profile />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};
