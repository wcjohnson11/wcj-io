const path = require('path')
const { fmImagesToRelative } = require('gatsby-remark-relative-images');

exports.onCreateNode = ({ node }) => {
  fmImagesToRelative(node);
};

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions
    
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
        `).then(results => {
            results.data.allMarkdownRemark.edges.forEach(({node}) => {
                createPage({
                    path: `/blog/${node.frontmatter.slug}`,
                    component: path.resolve('./src/components/postLayout.js'),
                    context: {
                        slug: node.frontmatter.slug
                    }
                })
            })
            resolve()
        })
    })
}
