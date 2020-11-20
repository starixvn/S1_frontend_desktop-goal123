import React, { useState, useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import LeftMenu from "../components/common/leftMenu";
import Withdrawal from "../components/withdrawal/withdrawal.set.bank";
import RecentHistory from "../components/withdrawal/recentHistory";
import Loading from "../components/common/loading";
import { popBoxContext } from "../components/common/context";
import { defPopBoxType } from "../components/common/popBox";
import { api_account_GetWithdrawalAvailableBalance } from "../service/api/account";
import {
	api_payment_KycCheck,
	api_payment_GetWithdrawalInfoRecent
} from "../service/api/payment";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section className="inside">
						<LeftMenu />
						<div className="rightModule">
							<Content />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};

const Content = () => {
	const { t } = useTranslation();

	const [loading, setLoading] = useState(true);
	const [balanceData, setBalanceData] = useState({});
	const [kycStatus, setKycStatus] = useState("");
	const [recentData, setRecentData] = useState([]);

	const { setPopBox } = useContext(popBoxContext);

	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		async function getData() {
			setLoading(true);
			await Promise.all([
				getKycStatus(),
				getWithdrawalAvailableBalance(),
				getWithdrawalInfoRecent()
			]);
			setLoading(false);
		}
		getData();
	}, []);

	const closePopBox = () => {
		setPopBox({ isOpen: false });
	};

	const getKycStatus = async () => {
		await api_payment_KycCheck().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setKycStatus("normal");
					} else if (res.data.errorCode === 1) {
						setKycStatus("kycUpload");
					} else if (res.data.errorCode === 2) {
						setKycStatus("kycPending");
					}
				}
			},
			() => {
				if (isMountedRef.current) {
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={closePopBox}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			}
		);
	};

	const getWithdrawalAvailableBalance = async () => {
		await api_account_GetWithdrawalAvailableBalance().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setBalanceData(res.data.data);
					} else {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={closePopBox}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
				}
			},
			() => {
				if (isMountedRef.current) {
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={closePopBox}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			}
		);
	};

	const getWithdrawalInfoRecent = async () => {
		await api_payment_GetWithdrawalInfoRecent().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setRecentData(res.data.data);
					} else {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={closePopBox}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
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
									onClick={closePopBox}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			}
		);
	};

	if (loading) return <Loading />;

	return (
		<>
			<div className="infoModule">
				<Withdrawal
					balanceData={balanceData}
					kycStatus={kycStatus}
					setLoading={setLoading}
					getKycStatus={getKycStatus}
					getWithdrawalInfoRecent={getWithdrawalInfoRecent}
					getWithdrawalAvailableBalance={
						getWithdrawalAvailableBalance
					}
				/>
			</div>
			<RecentHistory
				recentData={recentData}
				setRecentData={setRecentData}
				getKycStatus={getKycStatus}
				getWithdrawalAvailableBalance={getWithdrawalAvailableBalance}
				getWithdrawalInfoRecent={getWithdrawalInfoRecent}
			/>
		</>
	);
};
