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

export const ButtonUpload = styled("button", {
    backgroundColor: '#D6DBDF',
    border: '0px',
    borderTop: '1px solid #5D6D7E',
    borderBottom: '1px solid #5D6D7E',
    borderRight: '1px solid #5D6D7E',
    fontSize: '0.8rem',
    fontWeight: '500',
    marginTop:'0.1rem',
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
