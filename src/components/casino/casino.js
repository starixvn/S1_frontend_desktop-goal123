import React, { useState, useEffect, useRef, useContext } from "react";
import { api_site_GetGamelist } from "../../service/api/site";
import { useTranslation } from "react-i18next";
import CasinoFilter from "./casinoFilter";
import CasinoCard from "./casinoCard";
import { Pagination } from "../common/pagination";
import { userInfoContext } from "../common/context";
import { SET_CASINO_ENTER_PAGE } from "../../service/enterPage";
import { popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import {
	api_account_SetFavoriteGame,
	api_account_GetFavoriteGame
} from "../../service/api/account";

export default () => {
	const { t } = useTranslation();
	const isMountedRef = useRef(null);
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const path_tpid = Number(window.location.search.replace("?tpId=", ""));
	const [userLanguage, setUserLanguage] = useState("en");
	const [allData, setAllData] = useState([]);
	const [filterData, setFilterData] = useState([]);
	const [pagination, setPagination] = useState({
		totalPages: 0,
		currentPage: 1
	});
	const firstPage = 1;
	const perPageCardItem = 20;
	const [perPageData, setPerPageData] = useState([]);
	const [btnActive, setBtnActive] = useState("All");
	const [provierItem, setProvierItem] = useState("ALL");
	const [selectedIdx, setSelectedIdx] = useState(0);
	const [favoriteList, setFavoriteList] = useState([]);

	const tpIdList = {
		6: "GPI",
		8: "YGG",
		10: "SG",
		5: "PP",
		14: "PG"
	};

	const providerList = [
		{ id: 0, displayKey: "ALL" },
		{ id: 1, displayKey: "GPI" },
		{ id: 2, displayKey: "YGG" },
		{ id: 3, displayKey: "SG" },
		{ id: 4, displayKey: "PP" },
		{ id: 5, displayKey: "PG" }
	];

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		getGameList();
		getLangId();
		// getFavorite();
	}, []);

	useEffect(() => {
		getFavorite();
	}, [allData]);

	// useEffect(() => {
	// 	refreshProvider();
	// }, [perPageData]);

	// const refreshProvider = () => {
	// 	if (path_tpid) {
	// 		setProvierItem(tpIdList[path_tpid]);
	// 	}
	// };

	const getLangId = () => {
		let langId = userInfo.langId;
		if (langId === "en") {
			setUserLanguage("en");
		} else if (langId === "cs") {
			setUserLanguage("cs");
		} else if (langId === "ch") {
			setUserLanguage("ch");
		} else {
			setUserLanguage("en");
		}
	};

	const playLinkTo = () => {
		SET_CASINO_ENTER_PAGE();
	};

	const getGameList = () => {
		api_site_GetGamelist().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let originData = [];

						for (let i = 0; i < res.data.data.length; i++) {
							let addObj = {
								provider: res.data.data[i].name,
								playFree: res.data.data[i].playFree,
								tpId: res.data.data[i].value
							};

							for (
								let j = 0;
								j < res.data.data[i].gameList.data.length;
								j++
							) {
								let childItem =
									res.data.data[i].gameList.data[j];
								let newItem = Object.assign(childItem, addObj);

								originData.push(newItem);
							}
						}

						let m = originData.length;
						while (m > 1) {
							let index = Math.floor(Math.random() * m--);
							[originData[m], originData[index]] = [
								originData[index],
								originData[m]
							];
						}
						if (path_tpid) {
							let _filter = originData.filter(
								i => i.tpId === path_tpid
							);
							setFilterData(_filter);
							setPerPageData(
								_filter.slice(
									firstPage * perPageCardItem -
										perPageCardItem,
									firstPage * perPageCardItem
								)
							);
							resetPagination(_filter);
							setProvierItem(tpIdList[path_tpid]);
						} else {
							setFilterData(originData);
							resetPagination(originData);
							setPerPageData(
								originData.slice(
									firstPage * perPageCardItem -
										perPageCardItem,
									firstPage * perPageCardItem
								)
							);
						}
						setAllData(originData);
						// if(originData.length>0){
						// 	getFavorite()
						// }
					} else {
						alert(res.data.message);
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					alert(t("msg_ApiServerError"));
				}
			}
		);
	};

	const onSelectItem = i => {
		setSelectedIdx(i);
		let selectItem = providerList[i].displayKey;
		setProvierItem(selectItem);
		if (selectItem === "ALL") {
			let _filter = allData;
			setFilterData(_filter);
			setPerPageData(
				_filter.slice(
					firstPage * perPageCardItem - perPageCardItem,
					firstPage * perPageCardItem
				)
			);
			resetPagination(_filter);
		} else {
			let _filter = allData.filter(i => i.provider === selectItem);
			setFilterData(_filter);
			setPerPageData(
				_filter.slice(
					firstPage * perPageCardItem - perPageCardItem,
					firstPage * perPageCardItem
				)
			);
			resetPagination(_filter);
		}
	};

	const clickPageNumber = page => {
		setPagination(prev => ({ ...prev, currentPage: page }));
		setPerPageData(
			filterData.slice(
				page * perPageCardItem - perPageCardItem,
				page * perPageCardItem
			)
		);
	};

	const resetPagination = filter => {
		setPagination(prev => ({
			...prev,
			totalPages: Math.ceil(filter.length / 20),
			currentPage: 1
		}));
	};

	const getAllGame = e => {
		let _filter =
			provierItem === "ALL"
				? allData
				: allData.filter(i => i.provider === provierItem);
		setFilterData(_filter);
		setPerPageData(
			_filter.slice(
				firstPage * perPageCardItem - perPageCardItem,
				firstPage * perPageCardItem
			)
		);
		resetPagination(_filter);
		setBtnActive(e.target.name);
	};

	const getPromoGame = e => {
		let _filter = allData.filter(
			provierItem === "ALL"
				? i => i.promotion === 1
				: i => i.promotion === 1 && i.provider === provierItem
		);
		setFilterData(_filter);
		setPerPageData(
			_filter.slice(
				firstPage * perPageCardItem - perPageCardItem,
				firstPage * perPageCardItem
			)
		);
		resetPagination(_filter);
		setBtnActive(e.target.name);
	};

	const getFetureGame = e => {
		let _filter = allData.filter(
			provierItem === "ALL"
				? i => i.featured === true
				: i => i.featured === true && i.provider === provierItem
		);
		setFilterData(_filter);
		setPerPageData(
			_filter.slice(
				firstPage * perPageCardItem - perPageCardItem,
				firstPage * perPageCardItem
			)
		);
		resetPagination(_filter);
		setBtnActive(e.target.name);
	};

	const showLoginBox = () => {
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Login
		});
	};

	const saveFavorite = (key_tpId, key_gameId) => {
		let nowIsFavorite = favoriteList.includes(key_gameId);
		console.log("key_itemFavoirte:", nowIsFavorite);
		let ProviderId = key_tpId;
		let GameId = key_gameId;
		let IsRemove = nowIsFavorite ? true : false;
		console.log("IsRemove??", IsRemove);
		api_account_SetFavoriteGame(ProviderId, GameId, IsRemove).then(
			res => {
				if (isMountedRef.current) {
					console.log(res.data);
					if (res.data.errorCode === 0) {
						alert("已加入");
						getFavorite();
					} else {
						// alert(res.data.message);
						console.log("here");
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					// alert(t("msg_ApiServerError"));
				}
			}
		);
	};

	const getFavorite = () => {
		if (userInfo.isLogin) {
			api_account_GetFavoriteGame().then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							if (res.data.data && res.data.data.length > 0) {
								let pickFavorite = res.data.data.map(
									item => item.gameId
								);
								setFavoriteList(pickFavorite);
							}
						} else {
							alert(res.data.message);
						}
					}
				},
				err => {
					if (isMountedRef.current) {
						alert(t("msg_ApiServerError"));
					}
				}
			);
		}
	};

	const showFavorite = () => {
		console.log("favoriteList::", favoriteList);
		setBtnActive("favorite");
		let _filter = allData.filter(i => {
			return favoriteList.includes(i.gameId);
		});

		setFilterData(_filter);
		setPerPageData(
			_filter.slice(
				firstPage * perPageCardItem - perPageCardItem,
				firstPage * perPageCardItem
			)
		);
		resetPagination(_filter);
	};

	return (
		<div className="infoModule">
			<div className="inside-title icon icon-ow-casino">
				<span>{t("lbl_Casino")}</span>
			</div>
			<CasinoFilter
				getAllGame={getAllGame}
				getPromoGame={getPromoGame}
				getFetureGame={getFetureGame}
				btnActive={btnActive}
				providerList={providerList}
				provierItem={provierItem}
				onSelectItem={onSelectItem}
				selectedIdx={selectedIdx}
				showFavorite={showFavorite}
			/>
			<div className="slotList">
				{perPageData?.map((item, i) => {
					return (
						<CasinoCard
							key={`casino-card-${item}`}
							{...item}
							userLanguage={userLanguage}
							playLink={
								userInfo.isLogin
									? SET_CASINO_ENTER_PAGE.bind(
											this,
											item.tpId,
											item.gameId,
											item.playFree,
											userLanguage
									  )
									: showLoginBox
							}
							saveFavorite={saveFavorite.bind(
								this,
								item.tpId,
								item.gameId
							)}
							isFavorite={favoriteList.includes(item.gameId)}
						/>
					);
				})}
			</div>

			{pagination.totalPages !== 0 ? (
				<Pagination
					totalPages={pagination.totalPages}
					currentPage={pagination.currentPage}
					clickPageNumber={clickPageNumber}
				/>
			) : null}
		</div>
	);
};
