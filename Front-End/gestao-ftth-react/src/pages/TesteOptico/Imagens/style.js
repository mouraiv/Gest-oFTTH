import { styled } from "@stitches/react";

export const ImportArea = styled("div", {
    display: "flex",
    height: '60px',
    width: '100%',
    fontSize: '0.8rem',
    fontWeight: '700',
    paddingBottom: '0.7rem',
    paddingTop: '1rem',

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

export const ImagemArea = styled("div", {
    display: 'flex',
    backgroundColor: 'red',
    width: '100%',

    ".menuImagem":{
        backgroundColor:'Aqua',
        borderRadius: '0.5rem',
        height:'auto',
        width: '180px',
        marginTop: '0.3rem',
        marginBottom: '0.3rem'
    },

    ".displayImagem":{
        maxWidth: '100%',
        padding: '0.8rem',
        backgroundColor: 'Blue',
    },

});



