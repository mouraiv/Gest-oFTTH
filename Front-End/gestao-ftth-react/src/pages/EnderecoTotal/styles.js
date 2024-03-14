import { styled } from "@stitches/react";

export const Filter = styled("div", {
    display: "flex",
    backgroundColor: '#D6DBDF',
    width: '100%',
    fontSize: '0.8rem',
    fontWeight: '700',
    paddingBottom: '0.7rem',
    position:'relative'
});

export const InputText = styled("input", {
    width: "80px",
    fontSize: '0.8rem',
    fontWeight: '600',
    height: '25px',
    textTransform: 'uppercase',
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

export const ButtonUpload = styled("button", {
    backgroundColor: '#D6DBDF',
    border: '0px',
    borderTop: '1px solid #5D6D7E',
    borderBottom: '1px solid #5D6D7E',
    borderRight: '1px solid #5D6D7E',
    fontSize: '0.8rem',
    fontWeight: '500',
    marginTop:'0.3rem',
    width: '60px',
    height: '24px',
    color: '#13293d',
    cursor: 'pointer',


    '&:active' : {
        backgroundColor: '#5D6D7E',   
    }
});

export const ButtonExportarExcel = styled("button", {
    backgroundColor: '#229954',
    padding: '0.2rem',
    border: '1px solid #005A05',
    fontSize: '0.8rem',
    fontWeight: '500',
    width: '100px',
    color: '#ffffff',

    '&:active':{
    backgroundColor: '#196F3D',
    }
});

export const ButtonFilter = styled("button", {
    backgroundColor: '#13293d',
    border: '1px solid #5D6D7E',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    width: '80px',
    height: '27px',
    color: '#ffffff',

    '&:active':{
    backgroundColor: '#5D6D7E',
    }
});
