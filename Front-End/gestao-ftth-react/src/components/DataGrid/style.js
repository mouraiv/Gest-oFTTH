import { styled } from "@stitches/react";

export const Container = styled("div", {
    backgroundColor: 'WhiteSmoke',
    width: '100%',

    "#tableInfo" : {
        borderCollapse: 'collapse',
        width: '100%',
        fontSize: '0.7rem',
        textAlign: 'center',
    },
    
    "#tableInfo tr td":{
        backgroundColor: '#ffffff'
    },

    "#tableInfo td ":{
        fontWeight: '700',
        cursor: 'pointer',
    },

    "#tableInfo th, td": {
        height: '25px',
    },

    "#tableInfo .th_column" : {
        backgroundColor: '#D6DBDF',
        fontSize: '0.6rem',
        height: '18px'
    },

    "#tableContainer" :{
        width: '100%',
    },

    "#tableContainer tbody" : {
        borderLeft: '6px solid',
        borderTop: '1px solid ',
        borderBottom: '1px solid',
        borderRight: '1px solid ',
    },

    "#tableContainer tbody:hover" : {
        borderLeft: '1px solid',
    },

    "#tableContainer .td_ass" : {
        backgroundColor:"#212529",  
        height: '10px'
    },

    "#tableContainer .td_ass a" : {
        color: '#ffffff',
        fontSize: '0.6rem',
        fontWeight: '500'
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