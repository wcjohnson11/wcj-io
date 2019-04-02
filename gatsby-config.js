module.exports = {
	siteMetadata : {
		title       : `William Johnson`,
		description : `Analytics, Art, Data, Engineering`,
		author      : `@wcjohnson11`,
		siteName    : `wcj.io`,
		siteUrl     : `https://wcj.io`,
		image       : `/src/images/favicon.ico`
	},
	plugins      : [
		{
			resolve : `gatsby-source-filesystem`,
			options : {
				name : `uploads`,
				path : `${__dirname}/static/img`
			}
		},
		{
			resolve : `gatsby-source-filesystem`,
			options : {
				name : `images`,
				path : `${__dirname}/src/images`
			}
		},
		{
			resolve : `gatsby-source-filesystem`,
			options : {
				name : `posts`,
				path : `${__dirname}/src/posts`
			}
		},
				{
			resolve : `gatsby-source-filesystem`,
			options : {
				name : `projects`,
				path : `${__dirname}/src/projects`
			}
		},
		{
			resolve : `gatsby-transformer-remark`,
			options : {
				plugins : [
					// gatsby-remark-relative-images must
					// go before gatsby-remark-images
					// https://github.com/danielmahon/gatsby-remark-relative-images
					`gatsby-remark-relative-images`,
					{
						resolve : `gatsby-remark-images`,
						options : {
							// It's important to specify the maxWidth (in pixels) of
							// the content container as this plugin uses this as the
							// base for generating different widths of each image.
							maxWidth : 590
						}
					},
					{
						resolve: `gatsby-remark-prismjs`,
						options: {
							inlineCodeMarker: '`',
						},
					},
				]
			}
		},
		`gatsby-plugin-netlify`,
		`gatsby-plugin-sitemap`,
		`gatsby-plugin-netlify-cms`,
		`gatsby-plugin-styled-components`,
		`gatsby-plugin-react-helmet`,
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		`gatsby-plugin-offline`,
		{
			resolve : `gatsby-plugin-manifest`,
			options : {
				name             : `William Johnson Personal Site`,
				short_name       : `wcj.io`,
				start_url        : `/`,
				background_color : `#663399`,
				theme_color      : `#663399`,
				display          : `minimal-ui`,
				icon             : `src/images/favicon.png` // This path is relative to the root of the site.
			}
		},
		{
			resolve : `gatsby-plugin-typography`,
			options : {
				pathToConfigModule : `src/utils/typography.js`
			}
		}
	]
};
