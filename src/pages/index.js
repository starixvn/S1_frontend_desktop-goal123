import React from "react";
import { useTranslation } from "react-i18next";

import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";

import IndexBanner from "../styles/img/indexBanner.jpg";

import edgeImg1 from "../styles/img/EDGE1.jpg";
import edgeImg2 from "../styles/img/EDGE2.jpg";
import edgeImg3 from "../styles/img/EDGE3.jpg";

import specialImg1 from "../styles/img/verified.png";
import specialImg2 from "../styles/img/file.png";
import specialImg3 from "../styles/img/bank.png";
import specialImg4 from "../styles/img/speed.png";

import Marquee from "../components/home/marquee";
import News from "../components/home/news";
import EventSwipper from "../components/home/eventSwipper";
import config from "../config";
import GameQuickLinks from "../components/home/gameQuickLinks";

const IndexPage = () => {
	const { t } = useTranslation();
	return (
		<Wrapper>
			<Layout>
				<main>
					<div className="swiper-container">
						<div className="swiper-wrapper">
							<div className="swiper-slide">
								<img src={IndexBanner} alt="banner" />
							</div>
							<div className="swiper-slide">
								<img src={IndexBanner} alt="banner" />
							</div>
							<div className="swiper-slide">
								<img src={IndexBanner} alt="banner" />
							</div>
						</div>
					</div>
					<Marquee />
					<GameQuickLinks t={t} />
					<section>
						<EventSwipper />
						<News />
						<div className="edge">
							<div>
								<div className="title">The Edge Of Goal123</div>
								<span></span>
							</div>
							<div className="articleModule">
								<div>
									<img src={edgeImg1} />
								</div>
								<div>
									<img src={edgeImg2} />
								</div>
								<div>
									<img src={edgeImg3} />
								</div>
							</div>
						</div>
						<div className="special">
							<div>
								<img src={specialImg1} />
								<ul>
									<li className="title">Reputable Brand</li>
									<li>Official Partners of Spurs and NUFC</li>
								</ul>
							</div>
							<div>
								<img src={specialImg2} />
								<ul>
									<li className="title">More game type</li>
									<li>Official Partners of Spurs and NUFC</li>
								</ul>
							</div>
							<div>
								<img src={specialImg3} />
								<ul>
									<li className="title">Payment Method</li>
									<li>Official Partners of Spurs and NUFC</li>
								</ul>
							</div>
							<div>
								<img src={specialImg4} />
								<ul>
									<li className="title">Transaction Speed</li>
									<li>Official Partners of Spurs and NUFC</li>
								</ul>
							</div>
						</div>
						<Platforms />
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};

const defPlatform = [
	"saba",
	"ab",
	"yl",
	"ag",
	"gp",
	"dg",
	"sa",
	"yg",
	"pp",
	"sg",
	"pg"
];

const Platforms = () => {
	const platformRows = defPlatform.map(item => {
		return (
			<button key={`platform-${item}`}>
				<img src={`${config.imgUrl}/common/images/logo/${item}.png`} />
			</button>
		);
	});

	return <div className="platform">{platformRows}</div>;
};

export default IndexPage;
