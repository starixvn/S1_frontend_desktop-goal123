module.exports = {
	siteMetadata: {
		defaultLanguage: "vn",
		title: `Goal123`,
		description: `Goal123 là trang cá cược thể thao hàng đầu thế giới, cung cấp trải nghiệm tốt nhất cho người dùng trên tất cả môn thể thao, casino, xèng, keno, thể thao điện tử, casino RNG, thể thao fantasy, thể thao ảo, xổ số, casino trực tiếp, dealer trực tiếp, bingo và đua xe.`,
		author: `Goal123`,
		supportedLanguages: ["en", "vn"],
		siteUrl: "https://www.goal123.com"
	},
	plugins: [
		{
			resolve: `gatsby-plugin-sitemap`,
			options: {
				exclude: [`/en/*/`, `/en`, `*/404`, `/404.html`]
			}
		},
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/styles/img`
			}
		},
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`
		// {
		//   resolve: `gatsby-plugin-manifest`,
		//   options: {
		//     name: `gatsby-starter-default`,
		//     short_name: `starter`,
		//     start_url: `/`,
		//     background_color: `#663399`,
		//     theme_color: `#663399`,
		//     display: `minimal-ui`,
		//     icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
		//   },
		// },
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// `gatsby-plugin-offline`,
	]
};
