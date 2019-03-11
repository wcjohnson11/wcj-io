import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"

const HeaderWrapper = styled.header`
 background: red;
 margin-bottom: 1.45rem;
`

const HeaderContainer = styled.header`
  margin: 0 auto;
  max-width: 960px;
  padding: .4rem .4rem;
  h1 {
    margin: 0;
  }
`

const HeaderLink = styled(Link)`
  color: white;
  text-decoration: none;
  &:visited {
    color: white;
  }
  &:hover {
    color: #4c2c92;
  }
`

const Header = ({ siteTitle }) => (
  <HeaderWrapper>
    <HeaderContainer>
      <h1>
        <HeaderLink to="/">
          {siteTitle}
        </HeaderLink>
      </h1>
    </HeaderContainer>
  </HeaderWrapper>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
