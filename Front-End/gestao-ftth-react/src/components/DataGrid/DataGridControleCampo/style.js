import { styled } from "@stitches/react";

export const Container = styled("div", {
    backgroundColor: 'WhiteSmoke',
    minWidth: '100%',

    "#tableInfo" : {
        borderCollapse: 'collapse',
        minWidth: '100%',
        fontSize: '0.7rem',
        marginTop: '1rem',
        textAlign: 'center',
    },

    "#tableInfo td ":{
        fontWeight: '600',
    },

    "#tableInfo th, td": {
        height: '25px',
    },

    "#tableInfo .th_column" : {
        backgroundColor: '#D6DBDF',
        fontWeight: '700',
        fontSize: '0.6rem',
        height: '12px'
    },

    "#tableContainer tbody ":{
        border: '2px solid #13293d',
    },

    "#tableContainer .th_title" : {
        height: '3px'
    }

});

export const TableGridMenu = styled("div", {
    display: "flex",
    backgroundColor: '#D6DBDF',
    height: '30px',
    width: '100%',
    marginBottom: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '700',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',

    ".leftAngle:hover":{
       color: '#13293d',
       fill: '#13293d' 
    },
    ".rightAngle:hover":{
       color: '#13293d',
       fill: '#13293d' 
    },
    ".leftAngle":{
       marginLeft: '1.5rem',
       fontSize : '1.2rem',
       cursor: 'pointer',
       color: '#5D6D7E',
       fill: '#5D6D7E'    
    },
    ".rightAngle":{
       fontSize : '1.2rem', 
       marginLeft: '1rem',
       marginRight: '1rem',
       cursor: 'pointer',
       color: '#5D6D7E',
       fill: '#5D6D7E' 
    },
    ".total":{
       position: 'absolute',
       marginLeft: '1rem',
       left: 0,
    }
       
});

export const Button = styled("button", {
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