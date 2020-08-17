import React, { createRef, Component } from "react";
import { _ACTION_TYPE } from "../../service/enterPage";
import SubMenu from "./header.menu.sub";
import { defMenuLinks, defSubListClassName } from "./header.menu.def";
import MainMenu from "./header.menu.main";

export default class Panel extends Component {
	constructor(props) {
		super(props);
		if (typeof document !== `undefined`) {
			document.addEventListener("mouseover", this.handleClickOutside);
		}
		this.state = { menuKey: "" };
		this.wrapper = createRef(null);
	}

	handleClickOutside = e => {
		if (this.wrapper.current && !this.wrapper.current.contains(e.target)) {
			this.setState({ menuKey: "" });
		}
	};

	showSubMenu = col => {
		this.setState({ menuKey: col });
	};

	render() {
		let subItems = null;
		if (typeof defMenuLinks[this.state.menuKey]?.subMenu !== undefined) {
			subItems = defMenuLinks[this.state.menuKey]?.subMenu;
		}

		return (
			<div className="menu">
				<MainMenu showSubMenu={this.showSubMenu} />
				{subItems ? (
					<div className="subMenu-Wrapper active" ref={this.wrapper}>
						<SubMenu
							MenuKey={this.state.menuKey}
							listClassName={
								defSubListClassName[this.state.menuKey]
							}
							subItems={subItems}
						/>
					</div>
				) : null}
			</div>
		);
	}
}
