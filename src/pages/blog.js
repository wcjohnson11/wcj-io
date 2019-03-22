import React from 'react'
import styled from 'styled-components'

import Layout from '../components/layout'
import BlogListing from '../components/blogListing'

const Blog = ({location}) => (
    <Layout location={location}>
        <h1>Blog</h1>
        <BlogListing />
    </Layout>
)

export default Blog