import React from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import LeftMenu from "../components/common/leftMenu";
import Message from "../components/message/message";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section class="inside">
						<LeftMenu />
						<div class="rightModule">
							<Message />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};
