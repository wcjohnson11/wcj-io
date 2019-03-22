import React from 'react'

import Layout from '../components/layout'
import BlogListing from '../components/blogListing'

const Blog = ({location}) => (
    <Layout location={location}>
        <div>
            <h1>Blog</h1>
            <BlogListing />
        </div>
    </Layout>
)

export default Blog