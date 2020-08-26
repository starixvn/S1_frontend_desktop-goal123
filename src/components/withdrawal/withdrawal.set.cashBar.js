import React from "react";

export default props => {
	let minValue = 0;
	let maxValue = props.availableBalance;

	return (
		<div className="cashBar">
			{/* <div className="cashLine" style={{ width: "0%" }}> */}
			<input
				className="cashLine"
				type="range"
				min={minValue}
				max={maxValue}
				step="1"
				onChange={props.onChangeAmount}
				value={props.amountValue}
			/>
			<div className="cashPoint">
				<span>{props.amountValue}</span>
			</div>
			{/* </div> */}

			{/* <div className="cashLine" style={{ width: "0%" }}>
				<div className="cashPoint">
					<span>$0</span>
				</div>
			</div> */}
		</div>
	);
};
