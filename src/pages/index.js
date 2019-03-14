import React from "react"
import styled from "styled-components"

import Layout from "../components/layout"
import BlogListing from "../components/blogListing"
import ProjectListing from "../components/projectListing"

const H2 = styled.h2`
  padding: 1rem;
`

const IndexPage = ({location}) => (
  <Layout location={location}>
    <H2>Blog Posts</H2>
    <BlogListing />
    <H2>Projects</H2>
    <ProjectListing />
  </Layout>
)

export default IndexPage
