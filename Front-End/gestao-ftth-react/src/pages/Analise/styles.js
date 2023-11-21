import { styled } from "@stitches/react";

export const TableGrid = styled("table", {
    fontSize: '0.7rem',
    textAlign: 'center',

    "thead":{
        backgroundColor: '#13293d',
    },
    "tbody tr:nth-child(even)":{
        backgroundColor: '#D6DBDF'
    },
    "th":{
        color: 'White',
    },
    "td":{
        width: '350px',
        fontWeight: '700',
        border: '1px solid #D6DBDF',
        wordWrap: 'break-word',
        border: 0,
    },
    "th, td": {
        height: '25px',
    },

});

export const ButtonCdoia = styled("button", {
    fontSize: '0.6rem',
    border: '1px solid #13293d',
    borderRadius: '0.2rem',
    backgroundColor: '#D4AC0D',
    marginTop: '0.3rem',
    marginLeft: '0.3rem',
    marginRight: '0.3rem',
    marginBottom: '1rem',
    fontWeight: '800',
    width: '95%',
    height: '25px',
    color: '#13293d',
    cursor: 'pointer',

    '&:active' : {
        backgroundColor: '#F9E79F',   
    }
});

export const FooterButton = styled("div", {
    display:'flex',
    backgroundColor: '#d6dbdf',
    minWidth: '704px', 
    justifyContent: 'flex-end', 
    alignItems: 'flex-end',
    marginTop: '1.5rem',
    paddingTop: '1rem'

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

export const Button = styled("button", {
    backgroundColor: 'transparent',
    padding: '0rem',
    border: 'none',
    borderRadius: '0.2rem',
    fontSize: '0.8rem',
    height: '23px',
    color: '#13293d',
    textDecoration: 'underline',
    cursor: 'pointer',
    
    "&:active":{
        color: '#FFFFF',
        textDecoration: 'none'
    }
});