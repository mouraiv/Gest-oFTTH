import { styled } from "@stitches/react";

export const Filter = styled("div", {
    display: "flex",
    backgroundColor: '#D6DBDF',
    width: '100%',
    fontSize: '0.8rem',
    fontWeight: '700',
    paddingBottom: '0.7rem',
    
});

export const Painel = styled("div", {
    display: "flex",
    width: '100%',
    fontWeight: '700',
    margin: '1rem',
    color: '#ffffff',
    textAlign: 'center',

    '.viewComGanho':{
        backgroundColor: '#d4efdf',
        border: '1px solid green',
        color: 'green',
        padding: '0.5rem',
        marginRight: '0.3rem',
        borderRadius: '0.4rem',
        minWidth: '110px'
    },

    '.viewSemGanho':{
        backgroundColor: '#FADBD8',
        border: '1px solid red',
        color: 'red',
        padding: '0.5rem',
        marginRight: '0.3rem',
        borderRadius: '0.4rem',
        minWidth: '110px'
    },

    '.lab' : {
        fontSize: '0.6rem !important',
    },

    '.result' : {
        fontSize: '0.8rem',
    }
});

