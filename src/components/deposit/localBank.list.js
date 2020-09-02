import React, { useEffect, useRef, useState, useContext } from "react";
import path from "../../path";
import { Link } from "gatsby";
import { useTranslation } from "react-i18next";
import { api_payment_GetBankInfoOffList } from "../../service/api/payment";
import { popBoxContext } from "../common/context";
import Loading from "../common/loading";
import { defPopBoxType } from "../common/popBox";

const _path = path.deposit.sub.localBank.root;

export default () => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const [localBankList, setLocalBankList] = useState([]);
	const [loading, setLoading] = useState(true);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	useEffect(() => {
		api_payment_GetBankInfoOffList().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						if (res.data.data.length > 0) {
							setLocalBankList(res.data.data);
						}
					} else {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
					setLoading(false);
				}
			},
			err => {
				if (isMountedRef.current) {
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={ClickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
					setLoading(false);
				}
			}
		);
	}, []);

	return loading ? (
		<Loading />
	) : localBankList !== null && localBankList.length > 0 ? (
		<div className="subModule">
			<div className="subModuleTitle">
				<div>
					<span>{t("lbl_WireTransfers")}</span>
					<span>
						{t("lbl_CreditTime")}: {t("lbl_5mins")}
					</span>
				</div>
			</div>
			<div className="subModuleBody">
				<ul>
					<li>
						<Link to={_path} className="icon icon-library"></Link>
					</li>
				</ul>
			</div>
		</div>
	) : (
		<></>
	);
};
