import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import LeftMenu from "../components/common/leftMenu";
import Message from "../components/message/message";

export default () => {
	const { t } = useTranslation();
	const [getMsgList, setGetMsgList] = useState([]);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});
	// let arr =
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

const Item = props => {
	return (
		<>
			<div className="account">
				<div className="info">
					<label className="checkbox">
						<input type="checkbox" />
						<i className="icon icon-checkbox"></i>
					</label>
					<div className="introduction">
						<span className="title">
							Your Deposit DD521 has been Approved
						</span>
						<span>2/4/2020 10:31:00 PM</span>
					</div>
					<button className="icon icon-circle-right"></button>
				</div>
				<div className="content">
					Your deposit request DD521 has been Approved. Please check
					with CSD if you have any concern.
				</div>
			</div>
		</>
	);
};
