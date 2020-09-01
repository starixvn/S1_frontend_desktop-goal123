import React, { Component, createRef } from "react";
import PropTypes from "prop-types";

const defLangDisplayText = {
	// cs: "简体中文",
	en: "English",
	// th: "ภาษาไทย",
	// id: "Indonesian",
	vn: "Tiếng Việt"
};

const defLangList = () =>
	Object.keys(defLangDisplayText).map(k => {
		return { icon: `flag ${k}`, value: k };
	});

export class Dropdown extends Component {
	constructor(props) {
		super(props);
		if (typeof document !== `undefined`) {
			document.addEventListener("mousedown", this.handleClickOutside);
		}
		this.state = { isOpen: false };
		this.wrapper = createRef(null);
	}

	handleClickOutside = e => {
		if (this.wrapper.current && !this.wrapper.current.contains(e.target)) {
			this.setState({ isOpen: false });
		}
	};

	clickDropdown = e => {
		e.preventDefault();
		this.setState({ isOpen: !this.state.isOpen });
		if (this.props.clickDropdown) {
			this.props.clickDropdown();
		}
	};

	selectItem = value => {
		this.setState({ isOpen: false });
		this.props.onSelectItem(value);
	};

	render() {
		let arr = defLangList().map((item, idx) => {
			let key = `${this.props.mainKey}_${idx}`;
			return (
				<button
					key={key}
					className={item.icon}
					onClick={this.selectItem.bind(this, item.value)}>
					{defLangDisplayText[item.value]}
				</button>
			);
		});

		let selected = (
			<button className={`flag ${this.props.selectedValue}`}>
				{defLangDisplayText[this.props.selectedValue]}
			</button>
		);

		return (
			<div
				className={`${this.props.className}${
					this.state.isOpen ? " active" : ""
				}`}
				ref={this.wrapper}
				onClick={this.clickDropdown}>
				{selected}
				<div className={this.props.subClassName}>{arr}</div>
			</div>
		);
	}
}

Dropdown.propTypes = {
	className: PropTypes.string.isRequired,
	subClassName: PropTypes.string.isRequired,
	mainKey: PropTypes.string.isRequired,
	selectedValue: PropTypes.string.isRequired
};

export default Dropdown;
