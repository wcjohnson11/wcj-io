const path = require('path');
const { fmImagesToRelative } = require('gatsby-remark-relative-images');
const remark = require('remark');
const remarkHTML = require('remark-html');

exports.onCreateNode = ({ node, actions }) => {
	const { createNodeField } = actions;
	fmImagesToRelative(node);
	// Create HTML nodes for project sections
	if (node.frontmatter && node.frontmatter.sections) {
		node.frontmatter.sections.forEach((section) => {
			const { name, markdown } = section;
			createNodeField({
				node,
				name  : name,
				value : remark().use(remarkHTML).processSync(markdown).toString()
			});
		});
	}
};

exports.createPages = ({ graphql, actions }) => {
	const { createPage } = actions;

	return new Promise((resolve, reject) => {
		graphql(`
            {
                allMarkdownRemark {
                    edges {
                        node {
                            frontmatter {
                                slug
                            }
                        }
                    }
                }
            }
        `).then((results) => {
			results.data.allMarkdownRemark.edges.forEach(({ node }) => {
				createPage({
					path      : `/blog/${node.frontmatter.slug}`,
					component : path.resolve('./src/components/postLayout.js'),
					context   : {
						slug : node.frontmatter.slug
					}
				});
			});
			resolve();
		});
	});
};
