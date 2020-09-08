import React, { useState, useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Nav from "./casino.nav";
import {
	api_account_SetFavoriteGame,
	api_account_GetFavoriteGame
} from "../../service/api/account";
import { api_site_GetGamelist } from "../../service/api/site";
import { userInfoContext } from "../common/context";
import { defNav, defRowsPerPage, defSearchColumn } from "./casino.def";
import GameList from "./casino.gamelist";
import { Pagination } from "../common/pagination";
import { getUrlParameter } from "../common/common";
import SearchBox from "./casino.searchBox";

const matchKeyword = (name, _keyword) => {
	let keyword = _keyword.toLowerCase();
	return (
		Object.keys(name)?.filter(key => {
			return name[key].toLowerCase().indexOf(keyword) !== -1;
		}).length > 0
	);
};

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const [selNav, setSelNav] = useState(defNav.ALLGAMES.key);
	const [favorite, setFavorite] = useState([]);
	const [tpList, setTpList] = useState({});
	const [tpOptions, setTpOptions] = useState([]);
	const [gameDatas, setGameDatas] = useState(null);
	const [pageInfo, setPageInfo] = useState({ currentPage: 1, totalPages: 1 });
	const [displayGames, setDisplayGames] = useState([]);
	const [searchInfo, setSearchInfo] = useState({
		[defSearchColumn.searchText]: "",
		[defSearchColumn.provider]: { idx: 0, value: null }
	});

	const isMountedRef = useRef(null);
	const urlTpId = getUrlParameter("tpId");

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		setDisplayGames([]);
		api_site_GetGamelist().then(res => {
			if (res.data.errorCode === 0) {
				let _tpList = {};
				let _tpOptions = [{ displayText: "All", id: null }];
				let games = [];

				let hasPromo = false;
				let hasFeature = false;
				res.data.data.forEach(t => {
					_tpList[t.value] = { ...t };
					_tpOptions.push({
						displayText: t.displayText,
						id: t.value
					});

					if (t.gameList.data) {
						t.gameList.data.forEach(g => {
							hasPromo =
								hasPromo === false
									? g.promotion === 1
									: hasPromo;
							hasFeature =
								hasFeature === false
									? g.featured === true
									: hasFeature;

							games.push({
								tpId: t.value,
								...g
							});
						});
					}
				});

				if (games.length) {
					for (let i = 0; i < games.length; i++) {
						let idx = Math.floor(Math.random() * games.length);
						let tempEle1 = games[i];
						let tempEle2 = games[idx];

						games[i] = tempEle2;
						games[idx] = tempEle1;
					}
				}

				if (isMountedRef.current) {
					setTpList(_tpList);
					setGameDatas(games);
					setTpOptions(_tpOptions);

					let _searchInfo = searchInfo;

					if (urlTpId) {
						let idx = _tpOptions.findIndex(
							x => x.id === Number(urlTpId)
						);

						if (idx !== -1) {
							setSearchInfo(prevS => {
								_searchInfo = {
									...prevS,
									provider: {
										idx: idx,
										value: _tpOptions[idx].id
									}
								};
								return _searchInfo;
							});
						}
					}

					SetGames({
						_searchInfo: _searchInfo,
						_selNav: selNav,
						_gameDatas: games,
						_tpList: _tpList
					});
				}
			}
		});

		if (userInfo.isLogin) {
			api_account_GetFavoriteGame().then(res => {
				if (res.data.errorCode === 0 && res.data.data) {
					let fav = res.data.data.map(f => {
						return `${f.providerId}_${f.gameId}`;
					});
					if (isMountedRef.current) {
						setFavorite(fav);
					}
				}
			});
		}
	}, [userInfo.isLogin, urlTpId]);

	const FilterGames = (
		_searchInfo,
		_nav,
		initGameDatas,
		initTpList,
		_favorite
	) => {
		let _gameDatas = initGameDatas ?? gameDatas;
		let _tpList = initTpList ?? tpList;
		let tpId = _searchInfo.provider.value;
		let searchText = _searchInfo.searchText;

		const matchFilter = (tpId, g) => {
			let matchNav =
				(_nav === defNav.PROMO.key && g.promotion === 1) ||
				(_nav === defNav.FEATURED.key && g.featured === true) ||
				(_nav === defNav.FAVOURITE.key &&
					_favorite.includes(`${tpId}_${g.gameId}`)) ||
				_nav === defNav.ALLGAMES.key;
			return (
				matchNav &&
				(searchText === "" || matchKeyword(g.name, searchText))
			);
		};

		return _gameDatas?.filter(g => {
			let tp = _tpList[g.tpId];
			return (
				(tpId === null || tp.value === tpId) && matchFilter(tp.value, g)
			);
		});
	};

	const SetGames = ({
		_searchInfo,
		_selNav,
		_gameDatas,
		_tpList,
		_favorite = favorite
	}) => {
		let _displayGames = FilterGames(
			_searchInfo,
			_selNav,
			_gameDatas,
			_tpList,
			_favorite
		);

		let _totalPages =
			_displayGames.length === 0
				? 1
				: Math.ceil(_displayGames.length / defRowsPerPage);

		let _currentPage =
			pageInfo.currentPage > _totalPages
				? _totalPages
				: pageInfo.currentPage;
		setDisplayGames(_displayGames);
		setPageInfo(prevS => ({
			...prevS,
			currentPage: _currentPage,
			totalPages: _totalPages
		}));
	};

	const onSelectNav = navKey => {
		if (navKey !== selNav) {
			setSelNav(navKey);
			SetGames({
				_searchInfo: searchInfo,
				_selNav: navKey,
				_gameDatas: gameDatas,
				_tpList: tpList
			});
		}
	};

	const clickPageNumber = page => {
		setPageInfo(prevS => ({
			...prevS,
			currentPage: page
		}));
	};

	const onSetFavorite = (tpId, gameId) => {
		let key = `${tpId}_${gameId}`;
		let isRemove = favorite?.includes(key);
		let newFav = isRemove
			? favorite?.filter(f => f !== key)
			: [...favorite, key];

		setFavorite(newFav);
		SetGames({
			_searchInfo: searchInfo,
			_selNav: selNav,
			_gameDatas: gameDatas,
			_tpList: tpList,
			_favorite: newFav
		});
		if (userInfo.isLogin) {
			api_account_SetFavoriteGame(tpId, gameId, isRemove);
		}
	};

	const EditSearchField = (column, value, pressEnter) => {
		let _searchInfo = searchInfo;

		if (column === defSearchColumn.searchText) {
			setSearchInfo(prevS => {
				_searchInfo = { ...prevS, [column]: value };
				return _searchInfo;
			});
			if (pressEnter) {
				SubmitSearch(_searchInfo);
			}
		} else {
			setSearchInfo(prevS => {
				_searchInfo = {
					...prevS,
					[column]: { idx: value, value: tpOptions[value].id }
				};
				return _searchInfo;
			});

			SetGames({
				_searchInfo: _searchInfo,
				_selNav: selNav,
				_gameDatas: gameDatas,
				_tpList: tpList
			});
		}
	};

	const SubmitSearch = _searchInfo => {
		SetGames({
			_searchInfo: searchInfo,
			_selNav: selNav,
			_gameDatas: gameDatas,
			_tpList: tpList
		});
	};

	return (
		<div className="infoModule">
			<div className="inside-title icon icon-ow-casino">
				<span>{t("lbl_Slots")}</span>
			</div>
			<div className="casinoSelect">
				<Nav selNav={selNav} onSelectNav={onSelectNav} t={t} />
				<SearchBox
					t={t}
					tpOptions={tpOptions}
					EditSearchField={EditSearchField}
					searchInfo={searchInfo}
					submitSearch={SubmitSearch.bind(this, searchInfo)}
				/>
			</div>
			<GameList
				t={t}
				displayGames={displayGames}
				tpList={tpList}
				langId={userInfo.langId}
				isLogin={userInfo.isLogin}
				currentPage={pageInfo.currentPage}
				favorite={favorite}
				onSetFavorite={onSetFavorite}
			/>
			<Pagination
				totalPages={pageInfo.totalPages}
				currentPage={pageInfo.currentPage}
				clickPageNumber={clickPageNumber}
			/>
		</div>
	);
};
