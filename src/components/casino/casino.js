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

import { getUrlParameter } from "../common/common";

export default () => {
	const { t } = useTranslation();
	const isMountedRef = useRef(null);
	const { userInfo } = useContext(userInfoContext);
	const userIsLogin = userInfo.isLogin;
	const { setPopBox } = useContext(popBoxContext);
	const path_tpid = Number(getUrlParameter("tpId"));
	const [userLanguage, setUserLanguage] = useState("en");
	const [allData, setAllData] = useState([]);
	const [pagination, setPagination] = useState({
		totalPages: 0,
		currentPage: 1
	});
	const firstPage = 1;
	const perPageCardItem = 20;
	const [perPageData, setPerPageData] = useState([]);
	const [btnActive, setBtnActive] = useState("All");
	const [selectedIdx, setSelectedIdx] = useState(0);
	const [favoriteList, setFavoriteList] = useState([]);
	const [stateFavoriteList, setStateFavoriteList] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [providerList, setProviderList] = useState([]);
	const [providerItem, setProviderItem] = useState("ALL");

	//  providerList =
	// 	0: {id: 0, displayKey: "ALL", tpId: ""}
	//  1: {id: 1, displayKey: "GPI", tpId: 6}
	//  2: {id: 2, displayKey: "YGG", tpId: 8}
	//  3: {id: 3, displayKey: "Joker", tpId: 9}
	//  4: {id: 4, displayKey: "SG", tpId: 10}
	//  5: {id: 5, displayKey: "PP", tpId: 5}
	//  6: {id: 6, displayKey: "PG", tpId: 14}

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		getGameList();
		getLangId();
	}, []);

	useEffect(() => {
		getFavoriteStatus();
		onChangeDropdownByPathTpId();
	}, [allData]);

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

	const getGameList = () => {
		api_site_GetGamelist().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let providerOptions = [
							{
								id: 0,
								displayKey: "ALL",
								tpId: ""
							}
						];

						for (let i = 0; i < res.data.data.length; i++) {
							let addObj = {
								id: i + 1,
								displayKey: res.data.data[i].name,
								tpId: res.data.data[i].value
							};

							providerOptions.push(addObj);
						}
						setProviderList(providerOptions);

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

							setPerPageData(
								_filter.slice(
									firstPage * perPageCardItem -
										perPageCardItem,
									firstPage * perPageCardItem
								)
							);
							resetPagination(_filter);
						} else {
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

	const onChangeDropdownByPathTpId = () => {
		if (path_tpid) {
			let path_tpid_idx = providerList
				.map(i => i.tpId)
				.indexOf(path_tpid);
			setSelectedIdx(path_tpid_idx);
		}
	};

	const onSelectItem = i => {
		setSelectedIdx(i);
		let selectItem = providerList[i].displayKey;
		setProviderItem(selectItem);
		let _filter = allData.filter(
			i =>
				(selectItem === "ALL"
					? i.provider === i.provider
					: i.provider === selectItem) &&
				(i.gameId.toLowerCase().search(searchValue) !== -1 ||
					i.provider.toLowerCase().search(searchValue) !== -1 ||
					JSON.stringify(Object.values(i.name))
						.toLowerCase()
						.search(searchValue) !== -1) &&
				(btnActive === "promotion" ? i.promotion === 1 : i) &&
				(btnActive === "feature" ? i.featured === true : i) &&
				(btnActive === "favorite" && userIsLogin === true
					? favoriteList.includes(i.gameId)
					: i) &&
				(btnActive === "favorite" && userIsLogin === false
					? stateFavoriteList.map(o => o.gameId).includes(i.gameId)
					: i)
		);
		setPerPageData(
			_filter.slice(
				firstPage * perPageCardItem - perPageCardItem,
				firstPage * perPageCardItem
			)
		);
		resetPagination(_filter);
	};

	const clickPageNumber = page => {
		setPagination(prev => ({ ...prev, currentPage: page }));
		setPerPageData(
			allData.slice(
				page * perPageCardItem - perPageCardItem,
				page * perPageCardItem
			)
		);
	};

	const resetPagination = filter => {
		setPagination(prev => ({
			...prev,
			totalPages: Math.ceil(filter.length / perPageCardItem),
			currentPage: 1
		}));
	};

	const showLoginBox = () => {
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Login
		});
	};

	const getAllGame = e => {
		setBtnActive(e.target.name);
		let _filter = allData.filter(
			i =>
				(providerItem === "ALL"
					? i.provider === i.provider
					: i.provider === providerItem) &&
				(i.gameId.toLowerCase().search(searchValue) !== -1 ||
					i.provider.toLowerCase().search(searchValue) !== -1 ||
					JSON.stringify(Object.values(i.name))
						.toLowerCase()
						.search(searchValue) !== -1)
		);
		setPerPageData(
			_filter.slice(
				firstPage * perPageCardItem - perPageCardItem,
				firstPage * perPageCardItem
			)
		);
		resetPagination(_filter);
	};

	const showPromoGame = e => {
		setBtnActive(e.target.name);
		let _filter = allData.filter(
			i =>
				(providerItem === "ALL"
					? i.provider === i.provider
					: i.provider === providerItem) &&
				i.promotion === 1 &&
				(i.gameId.toLowerCase().search(searchValue) !== -1 ||
					i.provider.toLowerCase().search(searchValue) !== -1 ||
					JSON.stringify(Object.values(i.name))
						.toLowerCase()
						.search(searchValue) !== -1)
		);
		setPerPageData(
			_filter.slice(
				firstPage * perPageCardItem - perPageCardItem,
				firstPage * perPageCardItem
			)
		);
		resetPagination(_filter);
	};

	const showFetureGame = e => {
		setBtnActive(e.target.name);
		let _filter = allData.filter(
			i =>
				(providerItem === "ALL"
					? i.provider === i.provider
					: i.provider === providerItem) &&
				i.featured === true &&
				(i.gameId.toLowerCase().search(searchValue) !== -1 ||
					i.provider.toLowerCase().search(searchValue) !== -1 ||
					JSON.stringify(Object.values(i.name))
						.toLowerCase()
						.search(searchValue) !== -1)
		);
		setPerPageData(
			_filter.slice(
				firstPage * perPageCardItem - perPageCardItem,
				firstPage * perPageCardItem
			)
		);
		resetPagination(_filter);
	};

	const showFavoriteGame = e => {
		setBtnActive(e.target.name);
		let _filter = allData.filter(
			i =>
				(providerItem === "ALL"
					? i.provider === i.provider
					: i.provider === providerItem) &&
				favoriteList.includes(i.gameId) &&
				(i.gameId.toLowerCase().search(searchValue) !== -1 ||
					i.provider.toLowerCase().search(searchValue) !== -1 ||
					JSON.stringify(Object.values(i.name))
						.toLowerCase()
						.search(searchValue) !== -1)
		);
		setPerPageData(
			_filter.slice(
				firstPage * perPageCardItem - perPageCardItem,
				firstPage * perPageCardItem
			)
		);
		resetPagination(_filter);
	};

	const getFavoriteStatus = () => {
		if (userIsLogin) {
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

	const saveFavorite = (key_tpId, key_gameId) => {
		let nowIsFavorite = favoriteList.includes(key_gameId);
		let ProviderId = key_tpId;
		let GameId = key_gameId;
		let IsRemove = nowIsFavorite ? true : false;
		api_account_SetFavoriteGame(ProviderId, GameId, IsRemove).then(
			res => {
				if (isMountedRef.current) {
					getFavoriteStatus();
				}
			},
			err => {
				if (isMountedRef.current) {
					alert(t("msg_ApiServerError"));
				}
			}
		);
	};

	const addFavoriteToState = item => {
		if (!stateFavoriteList.includes(item)) {
			setStateFavoriteList([...stateFavoriteList, item]);
		} else {
			setStateFavoriteList(stateFavoriteList.filter(j => j !== item));
		}
	};

	const showStateFavoriteGame = e => {
		setBtnActive(e.target.name);
		let _filter = stateFavoriteList.filter(i =>
			providerItem === "ALL"
				? i.provider === i.provider
				: i.provider === providerItem
		);
		setPerPageData(
			_filter.slice(
				firstPage * perPageCardItem - perPageCardItem,
				firstPage * perPageCardItem
			)
		);
		resetPagination(_filter);
	};

	const onChangeSearch = e => {
		setSearchValue(e.target.value.toLowerCase());
	};

	const onClickSearch = () => {
		let _filter = allData.filter(
			i =>
				(providerItem === "ALL"
					? i.provider === i.provider
					: i.provider === providerItem) &&
				(i.gameId.toLowerCase().search(searchValue) !== -1 ||
					i.provider.toLowerCase().search(searchValue) !== -1 ||
					JSON.stringify(Object.values(i.name))
						.toLowerCase()
						.search(searchValue) !== -1) &&
				(btnActive === "favorite"
					? favoriteList.includes(i.gameId)
					: i) &&
				(btnActive === "promotion" ? i.promotion === 1 : i) &&
				(btnActive === "feature" ? i.featured === true : i)
		);
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
				showPromoGame={showPromoGame}
				showFetureGame={showFetureGame}
				showFavoriteGame={showFavoriteGame}
				showStateFavoriteGame={showStateFavoriteGame}
				btnActive={btnActive}
				providerList={providerList}
				onSelectItem={onSelectItem}
				selectedIdx={selectedIdx}
				isLogin={userIsLogin}
				onChangeSearch={onChangeSearch}
				searchValue={searchValue}
				onClickSearch={onClickSearch}
			/>
			<div className="slotList">
				{perPageData?.map((item, i) => {
					return (
						<CasinoCard
							key={`casino-card-${item}`}
							{...item}
							userLanguage={userLanguage}
							playLink={
								userIsLogin
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
							isFavorite={
								userIsLogin
									? favoriteList.includes(item.gameId)
									: stateFavoriteList.includes(item)
							}
							addFavoriteToState={addFavoriteToState.bind(
								this,
								item
							)}
							isLogin={userIsLogin}
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
