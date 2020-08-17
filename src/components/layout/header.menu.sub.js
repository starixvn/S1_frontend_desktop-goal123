import React from "react";

export default ({ listClassName, subItems, menuKey }) => {
	let rows = subItems.map(s => {
		return (
			<a
				key={`${menuKey}-${s.displayText}`}
				href=""
				className={s.className}>
				<span className={s.icon}>{s.displayText}</span>
			</a>
		);
	});

	return <div className={`${listClassName} active`}>{rows}</div>;
};
