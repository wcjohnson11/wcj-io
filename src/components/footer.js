import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
	text-align: center;
    flex-shrink: 0;
    background-color: ${props => props.theme.colorBackground};
`;

const Footer = ({ location, title }) => (
    <StyledFooter>
        © {new Date().getFullYear()}, Built by {title}
    </StyledFooter>
);

export default Footer;