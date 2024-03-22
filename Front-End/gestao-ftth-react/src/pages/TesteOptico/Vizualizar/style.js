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
    width: '700px',

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
        fontWeight: '700',
        border: '1px solid #D6DBDF',
        wordWrap: 'break-word'
    },
    "th, td": {
        height: '25px',
        boxSizing: 'border-box',
        display: 'table-cell'
    },
    ".mapsTd":{
        border:'2px solid #239B56',
        margin: 0,
        padding: 0,
        cursor: 'pointer'
    },
    ".mapsTd:hover":{
        backgroundColor:'#58D68D',
    },

    ".enderecoTr[id-statusganho='1']:hover" : {
        backgroundColor: '#F9E79F',
        color: '#13293d'
    },

    ".enderecoTr[id-statusganho='2']:hover" : {
        backgroundColor: '#F9E79F',
        color: '#13293d'
    },
      
    ".enderecoTr[id-statusganho='1']" : {
        backgroundColor: '#d4efdf',
        color: 'green'
    },
      
    ".enderecoTr[id-statusganho='2']" : {
        backgroundColor: '#fadbd8',
        color: 'red'
    },

    ".tableEnderecoTotal":{
        display: 'inline-block',
        fontSize: '0.6rem', 
        marginTop: '0.5rem', 

    },

    ".tableEnderecoTotal tbody":{ 
        overflowY: 'scroll',
        cursor: 'pointer'
    },

});

export const FooterButton = styled("div", {
    display:'flex',
    backgroundColor: '#d6dbdf',
    justifyContent: 'flex-end', 
    alignItems: 'flex-end',
    paddingTop: '1rem'

});

export const ButtonAnalise = styled("button", {
    backgroundColor: 'transparent',
    padding: '0rem',
    border: 'none',
    borderRadius: '0.2rem',
    marginLeft: '0.8rem',
    marginRight: '0.8rem',
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

export const ButtonEditar = styled("button", {
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
    color: '#17202A',
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