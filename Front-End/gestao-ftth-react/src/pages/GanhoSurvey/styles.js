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

    '.view':{
        backgroundColor: '#13293d',
        padding: '0.5rem',
        marginRight: '0.3rem',
        borderRadius: '0.4rem'
    },

    '.lab' : {
        fontSize: '0.6rem !important',
    },

    '.result' : {
        fontSize: '1rem',
    }
});

