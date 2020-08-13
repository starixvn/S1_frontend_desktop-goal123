import React from "react";

export default props => {
	return (
		<div className="checkbox">
			<div className="agree">
				<input
					type="checkbox"
					id={props.id}
					checked={props.checked}
					onChange={props.onChange}
				/>
				<label htmlFor={props.id}></label>
				{props.children}
			</div>
		</div>
	);
};
