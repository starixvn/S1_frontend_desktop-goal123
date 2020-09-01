import React from "react";
import { useTranslation } from "react-i18next";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";

export default () => {
	return (
		<Wrapper afterLogin={false}>
			<Layout>
				<main>
					<Content />
				</main>
			</Layout>
		</Wrapper>
	);
};

const Content = () => {
	const { t } = useTranslation();
	return (
		<section className="inside">
			<div id="leftMenu"></div>
			<div className="rightModule">
				<div className="infoModule">
					<div className="inside-title icon icon-icon32px_password">
						<span>{t("lbl_ForgetPassword")}</span>
						<div>{t("lbl_ForgetPwdHint")}</div>
					</div>
					<div className="forgetPassWord">
						<div className="inputBox">
							<i className="txt-blue12 icon icon-email"></i>
							<input />
						</div>
						<div className="btnGroup">
							<button className="btn-check">
								{t("lbl_Submit")}
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
