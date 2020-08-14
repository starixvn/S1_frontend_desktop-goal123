import React from "react";

import Responsibility1 from "../../styles/img/responsibility1.png";
import Responsibility2 from "../../styles/img/responsibility2.png";
import Licenses from "../../styles/img/licenses.png";
import SocialMedia1 from "../../styles/img/te.png";
import SocialMedia2 from "../../styles/img/tw.png";
import SocialMedia3 from "../../styles/img/fb.png";
import SocialMedia4 from "../../styles/img/yb.png";
import SocialMedia5 from "../../styles/img/ig.png";

export default () => {
	return (
		<footer>
			<div className="webmap">
				<div>
					<span className="title">About Goal123.com</span>
					<div>
						<a href="">Affiliate</a>
						<a href="">Rules and Regulation</a>
						<a href="">Disclaimer</a>
						<a href="">Privacy Policy</a>
						<a href="">Terms & Conditions</a>
						<a href="">Responsible Gambling</a>
					</div>
				</div>
				<div>
					<span className="title">Sports Betting</span>
					<div>
						<a href="">Soccer Betting</a>
						<a href="">Basketball Betting</a>
						<a href="">Badminton</a>
						<a href="">Football Betting</a>
						<a href="">Tennis Betting</a>
						<a href="">Hockey Betting</a>
						<a href="">E-Sport Betting</a>
					</div>
				</div>
				<div>
					<span className="title">Licenses</span>
					<div>
						<a href="">
							<img src={Licenses} />
						</a>
					</div>
				</div>
				<div>
					<span className="title">Payment Options</span>
					<div>
						<a href="">
							<img src={Responsibility1} />
						</a>
						<a href="">
							<img src={Responsibility2} />
						</a>
					</div>
				</div>
				<div>
					<span className="title">Social Media</span>
					<div>
						<a href="">
							<img src={SocialMedia1} />
						</a>
						<a href="">
							<img src={SocialMedia2} />
						</a>
						<a href="">
							<img src={SocialMedia3} />
						</a>
					</div>
					<div>
						<a href="">
							<img src={SocialMedia4} />
						</a>
						<a href="">
							<img src={SocialMedia5} />
						</a>
					</div>
				</div>
			</div>

			<div className="copyright">
				© Copyright 2020. Goal123. All Rights Reserved.
			</div>
		</footer>
	);
};
