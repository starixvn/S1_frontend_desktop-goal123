const siteName = "Goal123";

const getAffiliate = () => {
	if (typeof window === `undefined`) return "";

	let fullPath = window.location.hostname;
	let arr = fullPath.split(".");

	return arr.length === 3
		? `https://aff.${arr.filter((p, idx) => idx !== 0).join(".")}`
		: `https://aff.${arr.join(".")}`;
};

export const siteInfo = {
	affiliateLink: getAffiliate()
};

export default process.env.NODE_ENV === "production"
	? {
			siteName,
			apiURL: "",
			openURL: "",
			imgUrl: "",
			t_and_cURL: ""
	  }
	: {
			siteName,
			appURL: "http://localhost:8000",
			// apiURL: "http://localhost:60930",
			// imgUrl: "http://localhost:60930",
			// t_and_cURL: "http://localhost:60930",

			apiURL: "http://www.n88dev.com",
			imgUrl: "http://www.n88dev.com",
			t_and_cURL: "http://www.n88dev.com",
			openURL: "http://www.n88dev.com"
	  };
