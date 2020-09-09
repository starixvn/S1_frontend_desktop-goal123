import React, { useContext, useState, useEffect, useRef } from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../components/common/context";
import { api_account_GetWalletInfo } from "../service/api/account";
import { isConvert, checkAmount } from "../components/common/common.js";
import { api_tp_Transfer, api_tp_GetTransferRecent } from "../service/api/tp";
import { defPopBoxType } from "../components/common/popBox";
import RecentHistory from "../components/transferFunds/recentHistory";
import ShowWallets from "../components/transferFunds/showWallets";
import SetAmount from "../components/transferFunds/setAmount";
import LeftMenu from "../components/common/leftMenu";
import Loading from "../components/common/loading";

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

const defDirection = {
	MainToTp: 1,
	TpToMain: 2
};

const initStatus = {
	checked: null,
	tip: ""
};

const initDirection = {
	transferFrom: "lbl_MainWallet",
	transferTo: "lbl_TpWallet_1"
};

const Content = () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const [getWalletInfo, setGetWalletInfo] = useState([]);
	const [amount, setAmount] = useState("1");
	const [direction, setDirection] = useState(initDirection);
	const [getHistory, setGetHistory] = useState(null);
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState(initStatus);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		GetWalletInfo();
		GetTransferRecent();
	}, []);

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const GetWalletInfo = () => {
		api_account_GetWalletInfo().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let datas = res.data.data;

						let mainWallet = {
							id: 0,
							displayKey: "lbl_MainWallet",
							balance: datas.balance
						};

						let tpWalletArr = datas.tpWallets.map(item => {
							return {
								id: item.tpId,
								displayKey: `lbl_TpWallet_${item.tpId}`,
								balance: item.balance
							};
						});
						setLoading(false);
						setGetWalletInfo([mainWallet, ...tpWalletArr]);
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
						setLoading(false);
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
	};

	const Transfer = (_tpId, _amount, _direction) => {
		setLoading(true);

		api_tp_Transfer({
			TpId: _tpId === 0 ? 1 : _tpId,
			amount: _amount,
			direction: _direction
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 9) {
						// setPopBox({
						// 	isOpen: true,
						// 	popBoxType: defPopBoxType.TurnoverAccumulated,
						// 	currencyId: userInfo.currencyId,
						// 	turnover: res.data.data.turnover,
						// 	rollover: res.data.data.rollover
						// });
						// setLoading(false);
					} else if (res.data.errorCode === 0) {
						GetWalletInfo();
						GetTransferRecent();
						setAmount("1");
						setLoading(false);
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
						setLoading(false);
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
	};

	const GetTransferRecent = () => {
		api_tp_GetTransferRecent().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setGetHistory(res.data.data);
						setLoading(false);
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
				}
			}
		);
	};

	const changeDirection = () => {
		direction.transferFrom === "lbl_MainWallet"
			? setDirection({
					transferFrom: "lbl_TpWallet_1",
					transferTo: "lbl_MainWallet"
			  })
			: setDirection({
					transferFrom: "lbl_MainWallet",
					transferTo: "lbl_TpWallet_1"
			  });
	};

	const EditAmount = e => {
		let value = e.target.value;

		value = value.replace(/^(0+)|[^\d]+/g, "");
		ValidAmount(value);
		setAmount(value);
	};

	const ValidAmount = _amount => {
		const minAmount = 1;
		const _transferFrom = getWalletInfo.find(item => {
			return item.displayKey === direction.transferFrom;
		});
		const maxAmount = _transferFrom.balance;

		let result = checkAmount(_amount, minAmount, maxAmount, _isConvert, t);
		if (result.status !== 0) {
			setStatus({
				checked: false,
				tip: result.msg
			});
		} else {
			setStatus({
				checked: true,
				tip: ""
			});
		}
		return result.status === 0;
	};

	const clickInfo = () => {
		let _msg = status.tip === "" ? t("lbl_AmountTooltip") : "";
		setStatus({
			checked: null,
			tip: _msg
		});
	};

	const clickSubmit = e => {
		e.preventDefault();
		let result = ValidAmount(amount);
		let _direction =
			direction.transferFrom === "lbl_MainWallet"
				? defDirection.MainToTp
				: defDirection.TpToMain;

		if (result) {
			let real_amount = _isConvert
				? Number(amount) * 1000
				: Number(amount);

			let _wallet = getWalletInfo.find(item => {
				return item.displayKey === direction.transferFrom;
			});

			if (_wallet.balance < real_amount) {
				setPopBox({
					isOpen: true,
					popBoxType: defPopBoxType.ErrorMsg,
					message: t("msg_InsufficientFund"),
					btnBar: (
						<div className="btnGroup">
							<button className="btn-cancel" onClick={ClickClose}>
								{t("lbl_Close")}
							</button>
						</div>
					)
				});
			} else {
				Transfer(_wallet.id, real_amount, _direction);
			}
			setStatus(initStatus);
			setAmount("1");
			setDirection(initDirection);
		}
	};

	const restoreAll = idx => {
		let _wallet = getWalletInfo[idx];
		let _direction =
			getWalletInfo[idx].id === 0
				? defDirection.TpToMain
				: defDirection.MainToTp;

		let startId = idx === 0 ? 1 : 0;
		let startWallet = getWalletInfo[startId];

		if (startWallet.balance === 0) {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.ErrorMsg,
				message: t("msg_InsufficientFund"),
				btnBar: (
					<div className="btnGroup">
						<button className="btn-cancel" onClick={ClickClose}>
							{t("lbl_Close")}
						</button>
					</div>
				)
			});
		} else {
			Transfer(startWallet.id, startWallet.balance, _direction);
		}
	};

	return loading || getWalletInfo === [] ? (
		<Loading />
	) : (
		<div className="rightModule">
			<div className="infoModule">
				<div className="inside-title icon icon-transfer">
					<span>{t("lbl_TransferFunds")}</span>
				</div>
				<ShowWallets
					i18n={t}
					getWalletInfo={getWalletInfo}
					restoreAll={restoreAll}
					GetWalletInfo={GetWalletInfo}
					_isConvert={_isConvert}
				/>
				<SetAmount
					i18n={t}
					amount={amount}
					onChange={EditAmount}
					transferFrom={direction.transferFrom}
					transferTo={direction.transferTo}
					clickSubmit={clickSubmit}
					changeDirection={changeDirection}
					onBlur={ValidAmount.bind(this, amount)}
					clickInfo={clickInfo}
					checked={status.checked}
					tip={status.tip}
				/>
			</div>
			<RecentHistory
				getHistory={getHistory}
				GetTransferRecent={GetTransferRecent}
			/>
		</div>
	);
};
