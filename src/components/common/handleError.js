import React from "react";
import { defPopBoxType } from "../common/popBox";

export default ({ setPopBox, t, err }) => {
	const { name, message, response } = err;
	if (message === "Network Error") {
		//network error.
	} else if (response) {
		const ClickClose = () => {
			setPopBox({ isOpen: false });
		};

		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.ErrorMsg,
			message: `[${response.status}] ${t("msg_ApiServerError")}`,
			btnBar: (
				<div className="btnGroup">
					<button className="btn-cancel" onClick={ClickClose}>
						{t("lbl_Close")}
					</button>
				</div>
			)
		});
	}
};
