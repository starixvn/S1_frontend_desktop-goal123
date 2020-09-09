import React from "react";

export default ({ btnBar, message }) => {
	return (
		<div className="Success active">
			<div className="title">{message}</div>
			{btnBar}
		</div>
	);
};
