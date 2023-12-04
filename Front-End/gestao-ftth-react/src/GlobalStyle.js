import { globalCss, styled } from "@stitches/react"
import 'bootstrap/dist/css/bootstrap.min.css';

export const GlobalStyle = globalCss({
	'*': {    
            margin: '0px', 
            padding: '0px',
            fontFamily: 'Segoe UI',
            borderCollapse: 'collapse',
        },
        'body':{
            backgroundColor: 'whitesmoke', 
        },
        'p': {
          margin: 0,
          padding: 0  
        },
        'input' : {
            fontSize: 'revert',
        },
        'textarea': {
            fontSize: 'revert',
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

    export const ButtonConfirma = styled("button", {
        backgroundColor: '#13293d',
        border: 'none',
        borderRadius: '0.3rem',
        marginRight:'0.5rem',
        marginBottom: '0.7rem',
        fontSize: '0.8rem',
        minWidth: '100px',
        height: '30px',
        color: '#FFFFFF',
        cursor: 'pointer',
    
        '&:active' : {
            backgroundColor: '#5D6D7E',   
        }
    });
    
    export const ButtonCancelar = styled("button", {
        backgroundColor: '#D6DBDF',
        border: '1px solid #5D6D7E',
        borderRadius: '0.3rem',
        fontSize: '0.8rem',
        fontWeight: '500',
        marginRight:'0.5rem',
        marginBottom: '0.7rem',
        minWidth: '100px',
        height: '30px',
        color: '#13293d',
        cursor: 'pointer',
    
        '&:active' : {
            backgroundColor: '#5D6D7E',   
        }
    
    });
    