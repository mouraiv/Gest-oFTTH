import { styled } from "@stitches/react";

export const TableGridMenu = styled("div", {
    display: "flex",
    backgroundColor: '#D6DBDF',
    height: '30px',
    marginBottom: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '700',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '1rem',
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

export const TableGrid = styled("table", {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '0.7rem',
    textAlign: 'center',
    whiteSpace: 'nowrap',

    "thead":{
        backgroundColor: '#13293d',
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
        paddingLeft: '0.5rem',
        fontWeight: '700',
    },
    "th, td": {
        height: '25px',
    }
});