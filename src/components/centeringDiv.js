import React from 'react';
import styled from "styled-components";

const DIV = styled.div`
  display: flex;
  justify-content: center;
`;

const CenteringDiv = ({children}) => (
    <DIV>
        {children}
    </DIV>
);

export default CenteringDiv;
