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

    ".logoContainer" : {
        display: "flex",
        width: '290px',
    },
    ".title" : {
       fontSize: '1rem',
       fontWeight: 'normal',
       marginTop: '0.5rem',
       marginLeft: '1rem'
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
    img : {
        marginTop: '0.2rem',
        marginLeft: '0.5rem',
        width: '110px'
    }

});