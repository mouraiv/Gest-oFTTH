import { globalCss, styled } from "@stitches/react"

export const GlobalStyle = globalCss({
	'*': {    
            margin: '0px', 
            padding: '0px',
            fontFamily: 'Segoe UI',
            color: '#13293d', 
        },
        'body':{
            backgroundColor: 'whitesmoke', 
        }   
});

export const Template = styled("div", {
        height: '100vh',
        display: 'grid',
        gridTemplateAreas: '"header" "content" "footer"',
        gridTemplateRows: '40px 1fr 40px',
});

export const Content = styled("div", {
        gridArea :'content',     
        marginLeft: '1rem',
        marginRight: '1rem',
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
});