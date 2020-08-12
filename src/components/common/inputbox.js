import React from "react";

export default props => {
	return (
		<>
			<div className="inputBox">
				{props.icon ? <i className={`icon ${props.icon}`}></i> : null}
				{props.title ? (
					<i className="txt-blue12">{props.title}</i>
				) : null}
				<input
					type={props.inputType ?? "text"}
					placeholder={props.placeholder}
					onFocus={props.onFocus}
					onBlur={props.onBlur}
					onChange={props.onChange}
					value={
						props.value === null || props.value === undefined
							? ""
							: props.value
					}
					max={props.max ? props.max : null}
				/>
				{props.warning ? (
					<div className="iconModule">
						<i className={`icon ${props.warningIcon}`}></i>
					</div>
				) : props.checkIcon ? (
					<div className="iconModule">
						<i className={`icon ${props.checkIcon}`}></i>
					</div>
				) : null}
			</div>
			{props.tip ? <div className="tip active">{props.tip}</div> : null}
		</>
	);
};
