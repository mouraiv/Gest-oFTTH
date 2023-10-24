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

export const RotuloTitulo = styled("div", {
        display: 'grid',
        justifyContent: 'center',
        fontWeight: '400',
        width: '100%',
        backgroundColor: '#13293d',
        
        'p':{
                padding: '0.3rem',
                color: '#ffffff'
           }
});

export const MsgSucess = styled("div", {
        border: '1px solid green',
        padding: '0.3rem',
        backgroundColor: '#E9F7EF',
        marginBottom: '0.8rem',
        
        "p" : {
            color: 'green',
            fontSize: '0.7rem',
            fontWeight: '700'
        }
    });
    
    export const MsgError = styled("div", {
        border: '1px solid red',
        padding: '0.3rem',
        backgroundColor: '#FDEDEC',
        marginBottom: '0.8rem',
        
        "p" : {
            color: 'red',
            fontSize: '0.7rem',
            fontWeight: '700'
        }
    });
    
    export const ImputError = styled("div", {    
        "p" : {
            color: 'red',
            fontSize: '0.7rem',
            fontWeight: '700'
        }
    });
    