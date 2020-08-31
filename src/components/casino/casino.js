import React, { useState, useEffect, useRef, useContext } from "react";
import { api_site_GetGamelist } from "../../service/api/site";
import { useTranslation } from "react-i18next";
import CasinoCard from "./casinoCard";
import { Pagination } from "../common/pagination";
import { popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";

export default () => {
	const { t } = useTranslation();
	const isMountedRef = useRef(null);
	const { setPopBox } = useContext(popBoxContext);

	const [cardData, setCardData] = useState([]);
	const [pagination, setPagination] = useState({
		totalPages: 0,
		currentPage: 1
	});
	const [perPageCardItem] = useState(20);
	const [perPageData, setPerPageData] = useState([]);
	const [btnActive, setBtnActive] = useState("all");

	const indexOfLastCard = pagination.currentPage * perPageCardItem;
	const indexOfFirstCard = indexOfLastCard - perPageCardItem;

	const provider = ["Promo", "", "", "", ""];

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const clickPageNumber = page => {
		setPagination(prev => ({ ...prev, currentPage: page }));
		getGameList(page);
	};

	useEffect(() => {
		getGameList();
	}, []);

	const getGameList = () => {
		api_site_GetGamelist().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let newList = [];

						for (let i = 0; i < res.data.data.length; i++) {
							let addObj = {
								provider: res.data.data[i].name
							};

							for (
								let j = 0;
								j < res.data.data[i].gameList.data.length;
								j++
							) {
								let childItem =
									res.data.data[i].gameList.data[j];
								let newItem = Object.assign(childItem, addObj);

								newList.push(newItem);
							}
						}
						setCardData(newList);
						// setPerPageData(
						// 	newList.slice(indexOfFirstCard, indexOfLastCard)
						// );
						// getAllGame()
						getPerPageData(newList);
						getPaginationInfo(newList);

						// setPagination(prev => ({
						// 	...prev,
						// 	totalPages: Math.floor(newList.length / 20)
						// }));
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

	// 每頁顯示的資料
	const getPerPageData = filterData => {
		console.log("getPerPageData", filterData);
		setPerPageData(filterData.slice(indexOfFirstCard, indexOfLastCard));
	};

	// 頁數資料
	const getPaginationInfo = filterData => {
		console.log("page filterData", filterData);
		setPagination(prev => ({
			...prev,
			totalPages: Math.floor(filterData.length / 20)
		}));
	};

	const getAllGame = e => {
		let filterData = cardData;
		getPerPageData(filterData);
		getPaginationInfo(filterData);
		setBtnActive(e.target.name);
	};

	// const currentCardData = cardData.slice(indexOfFirstCard, indexOfLastCard);

	const getPromoGame = e => {
		let filterData = cardData.filter(item => item.promotion === 1);
		// setPerPageData(filterData);
		getPerPageData(filterData);
		getPaginationInfo(filterData);
		setBtnActive(e.target.name);
	};

	const getFetureGame = e => {
		let filterData = cardData.filter(item => item.featured === true);
		// setPerPageData(filterData);
		getPerPageData(filterData);
		getPaginationInfo(filterData);
		setBtnActive(e.target.name);
	};

	return (
		<div className="infoModule">
			{console.log("totalPages::", pagination.totalPages)}
			<div className="inside-title icon icon-ow-casino">
				<span>Casino</span>
			</div>
			<div className="casinoSelect">
				<div className="btnGroup promoType">
					<button
						name="all"
						onClick={getAllGame}
						className={
							btnActive === "all" ? "btn-check" : "blueBorder"
						}>
						All
					</button>
					<button
						name="promo"
						onClick={getPromoGame}
						className={
							btnActive === "promo" ? "btn-check" : "blueBorder"
						}>
						Promo
					</button>
					<button
						name="feature"
						onClick={getFetureGame}
						className={
							btnActive === "feature" ? "btn-check" : "blueBorder"
						}>
						Feature
					</button>
					<button className="blueBorder">Favourite</button>
				</div>
				<div className="inputBox">
					<i className="txt-blue12 icon icon-search"></i>
					<input />
				</div>
				<div>
					<div className="inputBox">
						<div className="dropdown">
							{/* <!--由header的選單決定Default brand--> */}
							<button className="btn">YGG</button>
							<div className="dropdown-container">
								<div className="dropdown-item">GPI</div>
								<div className="dropdown-item">JOKER</div>
								<div className="dropdown-item">SG</div>
								<div className="dropdown-item">PP</div>
								<div className="dropdown-item">PG</div>
							</div>
						</div>
					</div>
				</div>
				<div className="btnGroup">
					<button className="btn-check">Submit</button>
				</div>
			</div>

			<div className="slotList">
				{perPageData?.map((item, i) => {
					return <CasinoCard key={`casino-card-${item}`} {...item} />;
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
