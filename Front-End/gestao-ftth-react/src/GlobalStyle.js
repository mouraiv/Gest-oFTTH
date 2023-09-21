import { globalCss, styled } from "@stitches/react"

export const GlobalStyle = globalCss({
	'*': { 
            margin: 0, 
            padding: 0,
            fontFamily: 'Segoe UI',
            color: '#13293d' 
        }   
});
export const Template = styled("div", {
	backgroundColor: 'whitesmoke',
        height: '100vh',
        display: 'grid',
        gridTemplateAreas: '"header" "content" "footer"',
        gridTemplateRows: '40px 1fr 40px',
});

export const Content = styled("div", {
        gridArea :'content',
        margin: '1rem',
});