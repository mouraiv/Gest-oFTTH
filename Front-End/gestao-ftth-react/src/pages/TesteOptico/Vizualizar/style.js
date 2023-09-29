import { styled } from "@stitches/react";

export const TableGrid = styled("table", {
    borderCollapse: 'collapse',
    minWidth: '800px',
    fontSize: '0.7rem',
    textAlign: 'center',
    whiteSpace: 'nowrap',

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
        paddingLeft: '0.5rem',
        fontWeight: '700',
        border: '1px solid #D6DBDF',
    },
    "th, td": {
        height: '25px',
    }
});