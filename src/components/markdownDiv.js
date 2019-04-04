import React from 'react';
import styled from 'styled-components';

const Markdown = styled.div`
    blockquote {
        border-color: ${(props) => props.theme.colorPrimary}
    }
`

export default ({ content }) => (
    <Markdown
        dangerouslySetInnerHTML={{
            __html: content
        }}
    />
);
