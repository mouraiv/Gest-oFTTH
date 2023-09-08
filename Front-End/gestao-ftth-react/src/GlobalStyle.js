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
        display: 'grid',
        gridTemplateAreas: "'header' 'content' 'footer'",
        gridTemplateRows: '50px calc(100vh - 100px) 50px'
});