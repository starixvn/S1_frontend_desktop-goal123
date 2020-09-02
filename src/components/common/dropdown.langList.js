import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import { api_account_SetLanguage } from "../../service/api/account";

const SetReplaceChar = (str, idx, newChar) => {
	return `${str.substr(0, idx)}${newChar}${str.substr(idx + newChar.length)}`;
};

const defLangDisplayText = {
	en: "English",
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
		api_account_SetLanguage(value);
	};

	render() {
		let arr = defLangList().map((item, idx) => {
			let key = `${this.props.mainKey}_${idx}`;
			let url =
				window.location.pathname +
				window.location.search +
				window.location.hash;
			let newPathArr = SetReplaceChar(url, 1, item.value);
			return (
				<Link
					key={key}
					to={newPathArr}
					className={item.icon}
					onClick={this.selectItem.bind(this, item.value)}>
					{defLangDisplayText[item.value]}
				</Link>
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
