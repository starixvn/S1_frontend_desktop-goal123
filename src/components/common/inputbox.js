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
					onBlur={props.onBlur}
					onChange={props.onChange}
					value={
						props.value === null || props.value === undefined
							? ""
							: props.value
					}
					max={props.max ? props.max : null}
					readOnly={props.readOnly}
				/>
				{props.checked !== undefined ? (
					<div className="iconModule">
						{props._isConvert ? "('000)" : null}
						{props.checked === null ? (
							<i
								className={`icon icon-information-solid`}
								onClick={props.clickInfo}></i>
						) : props.checked ? (
							<i className={`icon icon-checkmark`}></i>
						) : !props.checked && props.checked !== null ? (
							<i className={`icon icon-cross`}></i>
						) : null}
					</div>
				) : null}
				{props.checkIcon ? (
					<div className="iconModule">
						<i className={`icon ${props.checkIcon}`}></i>
					</div>
				) : null}
			</div>
			{props.inputType !== "date" ? (
				<div className={`tip${props.tip ? " active" : ""}`}>
					{props.tip}
				</div>
			) : null}
		</>
	);
};
