import React from "react";

export default props => {
	return (
		<div className="infoModule">
			<a className="icon icon-arrow-left2" onClick={props.clickBack}></a>
			<article>
				<img src={props.imageURL} />
				<h1>{props.title}</h1>
				<pre>{props.content}</pre>
			</article>
		</div>
	);
};
