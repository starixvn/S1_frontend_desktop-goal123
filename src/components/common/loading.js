import React from "react";
import loading_img from "../../styles/img/loading-img.png";
import loading_img1 from "../../styles/img/loading-img1.png";
import loading_img2 from "../../styles/img/loading-img2.png";
import loading_img3 from "../../styles/img/loading-img3.png";

export default () => {
	return (
		<div className="loading">
			<img src={loading_img} alt="loading1" />
			<img src={loading_img1} alt="loading2" />
			<img src={loading_img2} alt="loading3" />
			<img src={loading_img3} alt="loading4" />
		</div>
	);
};
