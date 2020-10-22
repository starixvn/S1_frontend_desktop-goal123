import React, { useContext } from "react";
import PropTypes from "prop-types";
import Header from "../layout/header";
import Footer from "../footer/footer";
import SEO from "../seo";
import PopBox from "./popBox";
import "../../styles/css/swiper.css";
import "../../styles/css/style.css";
import "../../styles/css/font.css";
import "../../styles/css/datePicker.css";

const Layout = ({ children, showFooter = false }) => {
	return (
		<>
			<SEO />
			<Header />
			{children}
			{showFooter ? <Footer /> : null}
			<PopBox />
		</>
	);
};

Layout.propTypes = {
	children: PropTypes.node.isRequired
};

export default Layout;
