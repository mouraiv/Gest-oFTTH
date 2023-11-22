import { styled } from "@stitches/react"

export const HeaderStyle = styled("header", {
    gridArea: "header",
    background: '#13293d',
    justifyContent: 'center',
    height: '20px'
});

export const HeaderStyleUser = styled("header", {
    background: '#13293d',
    gridArea: "header",
    justifyContent: 'flex-end',
    position: 'relative',
    height: '40px',

    ".logoContainer" : {
        display: "flex",
        width: '400px',
    },
    ".title" : {
       fontSize: '1rem',
       fontWeight: 'normal',
       marginTop: '0.5rem',
       marginLeft: '1rem'
    },

    ".navBar":{
        position: 'absolute',
        top:0,
        right: 0,
        marginRight: '15rem',
    },

    ".navBar ul" : {
        margin:0,
        padding:0,
        height: '40px',
        listStyle: 'none'
    },

    ".navBar li" : {
        display: 'inline',
    },

    ".navBar li ul" : {
        position: 'absolute',
        top: '40px',
        right: 0,
        display: 'none',
    },

    ".navBar li:hover ul" : {
        display: 'block',
    },

    ".navBar li ul li" : {
        display: 'block',
        width: '141px',
    },

    ".navBar li ul li a" : {
        color: '#ffffff !important',
        fontSize: '0.9rem',
        fontWeight: '500',
        backgroundColor: '#13293d',
        borderBottom: '1px solid #2C3E50'
    },

    ".navBar li a": {
        textDecoration:'none',
        paddingTop:'0.6rem',
        paddingBottom:'0.5rem',
        paddingLeft:'1rem',
        paddingRight:'1rem',
        display: 'inline-block',
        cursor: 'pointer',
        color: '#ffffff !important',
        fontSize: '0.9rem',
        fontWeight: '500',
        backgroundColor: '#2C3E50',
        textDecoration: 'underline !important'
    },

    "li a:hover": {
        textDecoration: 'none !important',
        backgroundColor: '#13293d'
        
    },

    ".displayInfo" : {
        position: 'absolute',
        textAlign: 'left',
        width: 'auto',
        right: 0,
        top: '0.3rem'
    },
    ".displayContent" : {
        display: 'flex',
    },
    ".info" : {
        marginRight: '1.5rem'
    },
    ".logout" : {
        marginTop: '0.1rem',
        marginRight: '0.6rem'
    },
    "p": {
        fontSize: '0.7rem',
        fontWeight: 'normal',
        color : "#ffffff" 
    },
    "img" : {
        marginTop: '0.2rem',
        marginLeft: '0.5rem',
        width: '110px'
    }

});