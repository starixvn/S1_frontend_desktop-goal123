import React from "react";
import { Link } from "gatsby";
import path from "../../path";

export default ({ langId, t }) => (
	<div>
		<span className="title">{t("lbl_Promotions")}</span>
		<div>
			<Link to={`/${langId}/${path.promotion.root}`}>
				{t("lbl_Promotions")}
			</Link>
		</div>
	</div>
);
