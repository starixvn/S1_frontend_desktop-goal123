import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default props => {
	const { t } = useTranslation();
	const [barValue, setBarValue] = useState("");

	const handleSlider = e => {
		let value = e.target.value;
		setBarValue(value);
		props.getAmountValue(value);
	};

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
				onChange={handleSlider}
				value={props.amountValue}
			/>
			<div className="cashPoint">
				<span>{barValue}</span>
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
