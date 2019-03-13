import React from "react"

import Layout from "../components/layout"
import BlogListing from "../components/blogListing"
import ProjectListing from "../components/projectListing"

const IndexPage = ({location}) => (
  <Layout location={location}>
    <BlogListing />
    <ProjectListing />
  </Layout>
)

export default IndexPage
