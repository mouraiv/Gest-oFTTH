import { styled } from "@stitches/react";

export const ImportArea = styled("div", {
    display: "flex",
    height: '60px',
    width: '100%',
    fontSize: '0.8rem',
    fontWeight: '700',
    marginLeft:'0.8rem',

    'input[type=file]::file-selector-button':{
        backgroundColor: '#D6DBDF',
        border: 'none',
        borderRight: '1px solid #5D6D7E',
        borderTopLeftRadius: '0.3rem',
        borderBottomLeftRadius: '0.3rem',
        fontSize: '0.8rem',
        fontWeight: '500',
        width: '110px',
        height: '29px',
        color: '#13293d',
        cursor: 'pointer',

    },

    'input[type=file]::file-selector-button:active' : {
        backgroundColor: '#5D6D7E',   
    }

});

export const InputImport = styled("input", {
    border: '1px solid #5D6D7E',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    width: '350px',
    height: '29px',
    color: '#5D6D7E',
   
});

export const ButtonUpload = styled("button", {
    backgroundColor: '#D6DBDF',
    border: '1px solid #5D6D7E',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    marginLeft:'0.5rem',
    width: '80px',
    height: '30px',
    color: '#13293d',
    cursor: 'pointer',


    '&:active' : {
        backgroundColor: '#5D6D7E',   
    }
});

export const ButtonDownload = styled("button", {
    backgroundColor: '#D6DBDF',
    border: '1px solid #5D6D7E',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    marginLeft:'0.5rem',
    width: '130px',
    height: '30px',
    color: '#13293d',
    cursor: 'pointer',


    '&:active' : {
        backgroundColor: '#5D6D7E',   
    }
});

export const LinhaVertical = styled("div", {
    height: '26px',
    marginTop: '0.1rem',
    marginLeft: '0.8rem',
    marginRight: '0.3rem',
    borderLeft: '2px solid #5D6D7E'

});

export const SubMenu = styled("div", {
    display: 'flex',
    border: '0',
    width:'100%',
    marginBottom: '0.5rem',
});

export const ButtonImagem = styled("button", {
    border: '1px solid #5D6D7E',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    marginLeft:'0.3rem',
    marginBottom: '0.7rem',
    width: '100px',
    height: '30px',
    color: '#17202A',
    cursor: 'pointer',

    '&:active' : {
        backgroundColor: '#D6DBDF',   
    }
});


