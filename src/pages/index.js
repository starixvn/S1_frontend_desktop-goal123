import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@reach/router";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import path from "../path";

import IndexBanner from "../styles/img/indexBanner.jpg";
import teamAImg from "../styles/img/teamLogo1.png";
import teamBImg from "../styles/img/teamLogo2.png";

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

const defGameListDatas = [
	{
		displayKey: "lbl_Soccer",
		icon: "icon icon-soccer",
		gameId: 1,
		tpId: 1
	},
	{
		displayKey: "lbl_Basketball",
		icon: "icon icon-basketball",
		gameId: 2,
		tpId: 1
	},
	{
		displayKey: "lbl_Baseball",
		icon: "icon icon-baseball",
		gameId: 8,
		tpId: 1
	},
	{
		displayKey: "lbl_badminton",
		icon: "icon icon-badminton",
		gameId: 9,
		tpId: 1
	},
	{
		displayKey: "lbl_Tennis",
		icon: "icon icon-tennis",
		gameId: 5,
		tpId: 1
	},
	{
		displayKey: "lbl_eSports",
		icon: "icon icon-esport",
		gameId: 43,
		tpId: 1
	}
];

const defBattlePanel = [
	{
		title: "Football . Belarus.Premier League",
		teamA: { name: "Torpedo - Belaz", img: teamAImg, score: 2.35 },
		teamB: { name: "dinamo minsk", img: teamBImg, score: 3.52 },
		gameTime: { date: "04.03", time: "23:00" }
	},
	{
		title: "Football . Belarus.Premier League",
		teamA: { name: "Torpedo - Belaz", img: teamAImg, score: 2.35 },
		teamB: { name: "dinamo minsk", img: teamBImg, score: 3.52 },
		gameTime: { date: "04.03", time: "23:00" }
	},
	{
		title: "Football . Belarus.Premier League",
		teamA: { name: "Torpedo - Belaz", img: teamAImg, score: 2.35 },
		teamB: { name: "dinamo minsk", img: teamBImg, score: 3.52 },
		gameTime: { date: "04.03", time: "23:00" }
	}
];

const defPlatform = [
	"saba",
	"ab",
	"yl",
	"ag",
	"jk",
	"gp",
	"dg",
	"sa",
	"yg",
	"pp",
	"sg",
	"pg"
];

const IndexPage = () => {
	const { t } = useTranslation();

	const gameListRows = defGameListDatas.map(d => {
		return (
			<a href="" key={`Home-game-${d.displayKey}`} className={d.icon}>
				{t(d.displayKey)}
			</a>
		);
	});

	const battleRows = defBattlePanel.map((item, i) => {
		return (
			<div className="swiper-slide" key={`battle-${i}`}>
				<div>{item.title}</div>
				<div className="team">
					<div>
						<img src={item.teamA.img} />
						{item.teamA.name}
					</div>
					<div className="schedule icon icon-soccer">
						{item.gameTime.date}
						<br />
						{item.gameTime.time}
					</div>
					<div>
						<img src={item.teamB.img} />
						{item.teamB.name}
					</div>
				</div>
				<div className="odds">
					<div>{item.teamA.score}</div>
					<div>PLACE A BET</div>
					<div>{item.teamA.score}</div>
				</div>
			</div>
		);
	});

	const platformRows = defPlatform.map(item => {
		return (
			<a href="" key={`platform-${item}`}>
				<img
					src={`http://www.n88dev.com/common/images/logo/${item}.png`}
				/>
			</a>
		);
	});

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
					<div className="gameMenu">
						<div>{gameListRows}</div>
					</div>

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
						<div className="platform">{platformRows}</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};

export default IndexPage;
