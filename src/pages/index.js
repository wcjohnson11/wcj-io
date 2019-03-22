import React from "react"
import styled from "styled-components"

import Layout from "../components/layout"
import BlogListing from "../components/blogListing"
import ProjectListing from "../components/projectListing"

const IndexPage = ({location}) => (
  <Layout location={location}>
    <h1>Blog Posts</h1>
    <BlogListing />
    <h1>Projects</h1>
    <ProjectListing />
  </Layout>
)

export default IndexPage
