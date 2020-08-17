import React from "react";
import defStep from "../deposit/defStep";

export default ({ t, step }) => {
	let rows = defStep.map((s, sIdx) => {
		return (
			<div
				className={sIdx <= step - 1 ? "active" : ""}
				key={`step-${s.title}`}>
				<span>{s.title}</span>
				<span>{t(s.descriptionKey)}</span>
			</div>
		);
	});

	return <div className="stepBar">{rows}</div>;
};
