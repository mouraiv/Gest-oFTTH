import { styled } from "@stitches/react";

export const TableGrid = styled("table", {
    borderCollapse: 'collapse',
    fontSize: '0.7rem',
    textAlign: 'center',

    "thead":{
        backgroundColor: '#13293d',
        border: '1px solid #13293d',
    },
    "tbody tr:nth-child(even)":{
        backgroundColor: '#D6DBDF'
    },
    "th":{
        color: 'White',
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
    },
    "td":{
        width: '350px',
        paddingLeft: '0.5rem',
        fontWeight: '700',
        border: '1px solid #D6DBDF',
        wordWrap: 'break-word'
    },
    "th, td": {
        height: '25px',
    },

});

export const FooterButton = styled("div", {
    display:'flex',
    backgroundColor: '#d6dbdf',
    minWidth: '720px', 
    justifyContent: 'flex-end', 
    alignItems: 'flex-end',
    marginTop: '1.5rem',
    paddingTop: '1rem'

});

export const ButtonConfirma = styled("button", {
    backgroundColor: '#13293d',
    border: '1px solid #5D6D7E',
    borderRadius: '0.3rem',
    marginRight:'0.5rem',
    marginBottom: '0.7rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    width: '100px',
    height: '30px',
    color: '#ffffff',
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
    width: '100px',
    height: '30px',
    color: '#13293d',
    cursor: 'pointer',

    '&:active' : {
        backgroundColor: '#5D6D7E',   
    }
});

export const ButtonImagem = styled("button", {
    border: '1px solid #5D6D7E',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    marginLeft:'0.5rem',
    marginBottom: '0.7rem',
    width: '100px',
    height: '30px',
    color: '#13293d',
    cursor: 'pointer',

    '&:active' : {
        backgroundColor: '#D6DBDF',   
    }
});