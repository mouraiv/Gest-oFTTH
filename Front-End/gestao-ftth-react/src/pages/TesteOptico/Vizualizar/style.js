import { styled } from "@stitches/react";

export const ContentTabs = styled("div", {
    width:'700px',
    marginBottom: '1rem',
    marginTop: '1rem',
    fontSize: '0.9rem',
    fontWeight: '600',

    '.nav-link' : {
       color: '#13293d',
       textDecoration: 'underline',
       cursor: 'pointer'
    },
    
    '.nav-link:hover' : {
        textDecoration: 'none'
     },

    '.nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active' : {
        textDecoration: 'none',
        color: '#13293d'
     }

});

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
    justifyContent: 'flex-end', 
    alignItems: 'flex-end',
    marginTop: '1.5rem',
    paddingTop: '1rem'

});

export const ButtonEditar = styled("button", {
    backgroundColor: '#AEB6BF',
    border: '1px solid #17202A',
    borderRadius: '0.3rem',
    marginRight:'0.5rem',
    marginBottom: '0.7rem',
    fontSize: '0.8rem',
    fontWeight: '600',
    minWidth: '100px',
    height: '30px',
    color: '#17202A',
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

export const ButtonValidar = styled("button", {
    border: '1px solid #145A32',
    backgroundColor: '#D4EFDF',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    marginLeft:'0.5rem',
    marginBottom: '0.7rem',
    width: '100px',
    height: '30px',
    color: '#145A32',
    cursor: 'pointer',

    '&:active' : {
        backgroundColor: '#F7DC6F',   
    }
});

export const ButtonReValidar = styled("button", {
    border: '1px solid #7B241C',
    backgroundColor: '#F2D7D5',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    marginLeft:'0.5rem',
    marginBottom: '0.7rem',
    width: '100px',
    height: '30px',
    color: '#7B241C',
    cursor: 'pointer',

    '&:active' : {
        backgroundColor: '#D98880',   
    }
});