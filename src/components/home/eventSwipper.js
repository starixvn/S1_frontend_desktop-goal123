import React from "react";
import SwipperBanner from "../common/swipperBanner";

export default () => {
	return (
		<div className="offers">
			<SwipperBanner
				ImgFolder="Sports"
				withBtn={true}
				openInBlank={true}
			/>
		</div>
	);
};
