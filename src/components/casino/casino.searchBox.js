import React from "react";
import Dropdown from "../common/dropdown";

export default ({
	tpOptions,
	EditSearchField,
	searchInfo,
	submitSearch,
	t
}) => {
	const EditField = e => {
		EditSearchField("searchText", e.target.value, e.key === "Enter");
	};

	const KeyPress = e => {
		if (e.key === "Enter") {
			EditSearchField("searchText", e.target.value, e.key === "Enter");
		}
	};

	return (
		<>
			<div>
				<div className="inputBox">
					<Dropdown
						mainkey="casino-provider"
						options={tpOptions}
						onSelectItem={EditSearchField.bind(this, "provider")}
						selectedIdx={searchInfo.provider.idx}
					/>
				</div>
			</div>
			<div className="inputBox">
				<i className="txt-blue12 icon icon-search"></i>
				<input
					type="text"
					onKeyPress={KeyPress}
					onChange={EditField}
					value={searchInfo.searchText}
				/>
			</div>
			<div className="btnGroup">
				<button className="btn-check" onClick={submitSearch}>
					{t("lbl_Submit")}
				</button>
			</div>
		</>
	);
};
