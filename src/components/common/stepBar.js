import React from "react";

export default ({ t, step, defStep }) => {
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
