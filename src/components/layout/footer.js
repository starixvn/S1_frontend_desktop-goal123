import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../common/context";
import { defSportsBetting } from "./footer.def";
import LinkItems from "../common/linkItems";

import Responsibility1 from "../../styles/img/responsibility1.png";
import Responsibility2 from "../../styles/img/responsibility2.png";
import Licenses from "../../styles/img/licenses.png";
import SocialMedia1 from "../../styles/img/te.png";
import SocialMedia2 from "../../styles/img/tw.png";
import SocialMedia3 from "../../styles/img/fb.png";
import SocialMedia4 from "../../styles/img/yb.png";
import SocialMedia5 from "../../styles/img/ig.png";
import TandC from "../../service/t_and_c";

const Bettings = ({ t, langId, isLogin }) => {
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

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);

	return (
		<footer>
			<div className="webmap">
				<div>
					<span className="title">{t("lbl_AboutGoal123")}</span>
					<div>
						<button>{t("lbl_Affiliates")}</button>
						<a
							href={TandC(userInfo.langId).RuleRegulations}
							target="_blank">
							{t("lbl_RuleRegulations")}
						</a>
						<button href="">Disclaimer</button>
						<a
							href={TandC(userInfo.langId).PrivacyPolicy}
							target="_blank">
							{t("lbl_PrivacyPolicy")}
						</a>
						<a href={TandC(userInfo.langId).terms} target="_blank">
							{t("lbl_TermsConditions")}
						</a>
						<a
							href={TandC(userInfo.langId).OurPolicies}
							target="_blank">
							Responsible Gambling
						</a>
					</div>
				</div>
				<Bettings
					t={t}
					langId={userInfo.langId}
					isLogin={userInfo.isLogin}
				/>
				<div>
					<span className="title">Licenses</span>
					<div>
						<button>
							<img src={Licenses} />
						</button>
					</div>
				</div>
				<div>
					<span className="title">Payment Options</span>
					<div>
						<button>
							<img src={Responsibility1} />
						</button>
						<button>
							<img src={Responsibility2} />
						</button>
					</div>
				</div>
				{/* <div>
					<span className="title">Social Media</span>
					<div>
						<a href="">
							<img src={SocialMedia1} />
						</a>
						<a href="">
							<img src={SocialMedia2} />
						</a>
						<a href="">
							<img src={SocialMedia3} />
						</a>
					</div>
					<div>
						<a href="">
							<img src={SocialMedia4} />
						</a>
						<a href="">
							<img src={SocialMedia5} />
						</a>
					</div>
				</div> */}
			</div>

			<div className="copyright">
				© Copyright 2020. Goal123. All Rights Reserved.
			</div>
		</footer>
	);
};
