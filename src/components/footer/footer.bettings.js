import React from "react";
import { defSportsBetting } from "./footer.def";
import LinkItems from "../common/linkItems";

export default ({ t, langId, isLogin }) => {
	return (
		<div>
			<span className="title">{t("lbl_SportsBetting")}</span>
			<div>
				<LinkItems
					defMenuLinks={defSportsBetting}
					t={t}
					langId={langId}
					isLogin={isLogin}
					checkMatchPage={false}
				/>
			</div>
		</div>
	);
};
