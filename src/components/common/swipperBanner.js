import React, { useEffect, useState, useContext, useRef } from "react";
import Swiper from "react-id-swiper";
import config from "../../config";
import { api_site_GetBanner } from "../../service/api/site";
import {
	userInfoContext,
	navContext,
	defNavPanel
} from "../../components/common/context";
import { SET_ENTER_PAGE } from "../../service/enterPage";
import path from "../../path";

export const ClickLink = (
	tpId,
	gameId,
	lang,
	href,
	isOuterLink,
	urlWithLang,
	isLogin,
	setNav,
	matchid,
	openInBlank
) => {
	if (href === "Casino/Lobby") {
		window.location.href = `/${path.casino.root}${tpId ? `/${tpId}` : ""}`;
	} else if (tpId === null) {
		if (href === "Promotion/Index") {
			window.location.href = `/${path.promotion.root}`;
		} else if (href === "Home/Register") {
		} else {
			window.open(
				isOuterLink
					? href
					: `${config.t_and_cURL}${
							urlWithLang ? `/${lang}` : ""
					  }/${href}`,
				"_blank"
			);
		}
	} else {
		SET_ENTER_PAGE({
			langId: lang,
			tpId,
			gameId,
			matchid,
			isLogin: isLogin === true,
			loginCallback: () => {
				setNav(defNavPanel.login);
			},
			openInBlank: openInBlank
		});
	}
};

const Panel = ({ ImgFolder, withBtn, openInBlank }) => {
	const [banner, setBanner] = useState([]);
	const { userInfo } = useContext(userInfoContext);
	const { setNav } = useContext(navContext);

	useEffect(() => {
		let mounted = true;
		api_site_GetBanner(ImgFolder, "", userInfo.langId).then(res => {
			if (res.data.errorCode === 0 && mounted) {
				setBanner(res.data.data);
			}
		});

		return () => (mounted = false);
	}, [userInfo, ImgFolder]);

	let rows = banner?.map(b => {
		let _imgFolder = b.imgFolder ?? ImgFolder;
		let lang =
			b.fromDB || b.lang?.includes(userInfo.langId)
				? userInfo.langId
				: "en";
		let actionLinkByLang = b.fromDB
			? null
			: b.actionLinkByLang?.find(a => a.lang === userInfo.langId);
		let actionLink = actionLinkByLang
			? actionLinkByLang.link
			: b.actionLink;
		let imgSRC = b.imgURL
			? b.imgURL
			: `${config.imgUrl}/CMS/${config.siteName}/${_imgFolder}/${lang}/${b.img}`;

		return (
			<button
				onClick={ClickLink.bind(
					this,
					b.tpId,
					b.gameId,
					lang,
					actionLink,
					b.outerLink === true,
					b.urlWithLang,
					userInfo.isLogin,
					setNav,
					b.matchid,
					openInBlank
				)}
				key={`${lang}-${b.img}`}>
				<img src={imgSRC} className="banner" alt={b.img ?? ""} />
			</button>
		);
	});

	return withBtn ? <AutoPlayWithBtn Rows={rows} /> : <Autoplay Rows={rows} />;
};

const defSwipperConfig = {
	spaceBetween: 30,
	centeredSlides: true,
	autoplay: {
		delay: 2500,
		disableOnInteraction: false
	},
	pagination: {
		el: ".swiper-pagination",
		clickable: true
	},
	rebuildOnUpdate: true
};

const Autoplay = props => {
	const params = defSwipperConfig;

	return <Swiper {...params}>{props.Rows}</Swiper>;
};

const AutoPlayWithBtn = ({ Rows }) => {
	const params = defSwipperConfig;
	const ref = useRef(null);

	const goNext = () => {
		if (ref.current !== null && ref.current.swiper !== null) {
			ref.current.swiper.slideNext();
		}
	};

	const goPrev = () => {
		if (ref.current !== null && ref.current.swiper !== null) {
			ref.current.swiper.slidePrev();
		}
	};

	return Rows && Rows.length > 0 ? (
		<>
			<div className="swiper-container">
				<div className="swiper-wrapper">
					<Swiper {...params} ref={ref}>
						{Rows}
					</Swiper>
				</div>
			</div>
			{Rows && Rows.length > 0 ? (
				<>
					<div className="swiper-button-next" onClick={goNext}></div>
					<div className="swiper-button-prev" onClick={goPrev}></div>
				</>
			) : null}
		</>
	) : (
		<></>
	);
};

export default Panel;
