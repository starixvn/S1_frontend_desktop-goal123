import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Inputbox from "./inputbox";
import Dropdown from "./dropdown";

const quickPickList = [
	{ id: 0, displayKey: "lbl_Today" },
	{ id: 1, displayKey: "lbl_YesterDay" },
	{ id: 2, displayKey: "lbl_ThisWeek" },
	{ id: 3, displayKey: "lbl_LastWeek" },
	{ id: 4, displayKey: "lbl_ThisMonth" },
	{ id: 5, displayKey: "lbl_LastMonth" }
];

export default props => {
	const { t } = useTranslation();

	const initQuickPick = props.keepData?.quickPick ?? 0;
	const [selectedIdx, setSelectedIdx] = useState(initQuickPick);

	const today = moment().format("YYYY-MM-DD");
	const initStartDate = props.keepData?.startDate ?? today;
	const initEndDate = props.keepData?.endDate ?? today;

	const [startDate, setStartDate] = useState(initStartDate);
	const [endDate, setEndtDate] = useState(initEndDate);

	let _startDate = "";
	let _endDate = "";

	const onSelectItem = i => {
		setSelectedIdx(i);

		if (quickPickList[i].displayKey === "lbl_Today") {
			_startDate = moment().format("YYYY-MM-DD");
			_endDate = moment().format("YYYY-MM-DD");
		} else if (quickPickList[i].displayKey === "lbl_YesterDay") {
			_startDate = moment().subtract(1, "days").format("YYYY-MM-DD");
			_endDate = moment().subtract(1, "days").format("YYYY-MM-DD");
		} else if (quickPickList[i].displayKey === "lbl_ThisWeek") {
			_startDate = moment().startOf("week").format("YYYY-MM-DD");
			_endDate = moment().format("YYYY-MM-DD");
		} else if (quickPickList[i].displayKey === "lbl_LastWeek") {
			_startDate = moment()
				.subtract(1, "weeks")
				.startOf("week")
				.format("YYYY-MM-DD");
			_endDate = moment()
				.subtract(1, "weeks")
				.endOf("week")
				.format("YYYY-MM-DD");
		} else if (quickPickList[i].displayKey === "lbl_ThisMonth") {
			_startDate = moment().startOf("month").format("YYYY-MM-DD");
			_endDate = moment().format("YYYY-MM-DD");
		} else if (quickPickList[i].displayKey === "lbl_LastMonth") {
			_startDate = moment()
				.subtract(1, "months")
				.startOf("month")
				.format("YYYY-MM-DD");
			_endDate = moment()
				.subtract(1, "months")
				.endOf("month")
				.format("YYYY-MM-DD");
		}

		setStartDate(_startDate);
		setEndtDate(_endDate);
	};

	const selectDate = (col, e) => {
		let val = e.target.value;
		col === "start" ? setStartDate(val) : setEndtDate(val);
	};

	return (
		<div className="quickSelect">
			<div>
				<div className="inputBox">
					<i className="txt-blue12">{t("lbl_QuickPick")}</i>
					<Dropdown
						i18n={t}
						mainKey="history_"
						options={quickPickList}
						selectedIdx={selectedIdx}
						onSelectItem={onSelectItem}
					/>
				</div>
			</div>

			<Inputbox
				inputType="date"
				value={startDate}
				max={moment().format("YYYY-MM-DD")}
				title={t("lbl_From")}
				onChange={selectDate.bind(null, "start")}
				checkIcon="icon-calendar"
			/>

			<Inputbox
				inputType="date"
				value={endDate}
				max={moment().format("YYYY-MM-DD")}
				title={t("lbl_To")}
				onChange={selectDate.bind(null, "end")}
				checkIcon="icon-calendar"
			/>

			<div className="btnGroup">
				<button
					className="btn-check"
					onClick={props.submitHandler.bind(
						this,
						startDate,
						endDate,
						false,
						selectedIdx
					)}>
					{t("lbl_Submit")}
				</button>
			</div>
		</div>
	);
};
