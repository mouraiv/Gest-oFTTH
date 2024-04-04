import { styled } from "@stitches/react";

export const NavArea = styled("div", {
    display: "flex",
    height: '60px',
    width: '100%',
    fontSize: '0.8rem',
    fontWeight: '700',
    paddingTop: '1.5rem',

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

export const ButtonImport = styled("button", {
    backgroundColor: '#13293d',
    border: '1px solid #5D6D7E',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    width: '130px',
    height: '30px',
    color: '#ffffff',
    cursor: 'pointer',


    '&:active' : {
        backgroundColor: '#5D6D7E',   
    }
});

export const ButtonDWG = styled("button", {
    backgroundColor: '#D6DBDF',
    border: '1px solid #5D6D7E',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    marginLeft:'0.5rem',
    width: '150px',
    height: '30px',
    color: '#13293d',
    cursor: 'pointer',

    '&:active' : {
        backgroundColor: '#5D6D7E',   
    }
});

export const ImagemArea = styled("div", {
    display: 'flex',
    backgroundColor: 'none',
    width: '100%',
    fontSize: '0.7rem',
    textDecoration: 'none',
    fontWeight: '600',
    wordBreak: 'break-all',

    "ul":{
        paddingLeft: 0
    },
    
    "li":{
        margin: '0.5rem',
        listStyleType:'none',
        cursor: 'pointer',
        paddingBottom: '0.4rem',
        borderBottom: '1px solid '
    },

    ".menuImagem":{
        height:'auto',
        width: '180px',
        marginTop: '0.5rem',
        
    },

    ".menuContainer":{
        backgroundColor:'#d6dbdf',
        paddingBottom: '0.3rem',
    },

    ".folder_0" : {
        display: 'none'
    },

    '.propImagem':{
        display: 'flex',
        justifyContent: 'end',
        padding: '0.5rem',
        position: 'absolute',
        borderTopLeftRadius: '0.5rem',
        borderTopRightRadius: '0.5rem',
        backgroundColor:'rgb(0 ,0, 0, 0.6)',
        textDecoration: 'underline',
        color: '#ffffff',
        left: '0',
        right: '0',
    },

    '.propImagem a':{
        textDecoration: 'underline',
        color: '#ffffff',
        cursor: 'pointer'
    },

    '.propImagem a:hover':{
        color: 'blue',
    },

    ".displayImagem":{
        maxWidth: '100%',
        margin: '0.6rem',
        position: 'relative',
    },

    "img":{
        borderRadius: '0.5rem',
        minWidth:'400px'
    }

});

export const ImportArea = styled("div", {
    display: "flex",
    alignItems: 'flex-end',
    height: '60px',
    width: '100%',
    fontSize: '0.8rem',
    fontWeight: '700',
    paddingBottom: '0.3rem',
    paddingTop: '0.5rem',

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
    backgroundColor: '#ffffff'
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





