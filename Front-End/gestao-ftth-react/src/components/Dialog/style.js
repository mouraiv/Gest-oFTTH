import { styled } from "@stitches/react";

export const ButtonConfirma = styled("button", {
    backgroundColor: '#13293d',
    border: '1px solid #5D6D7E',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    width: '100px',
    height: '30px',
    color: '#ffffff',
    cursor: 'pointer',


    '&:active' : {
        backgroundColor: '#5D6D7E',   
    }
});

export const ButtonCancelar = styled("button", {
    backgroundColor: '#D6DBDF',
    border: '1px solid #5D6D7E',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    marginRight:'0.5rem',
    width: '100px',
    height: '30px',
    color: '#13293d',
    cursor: 'pointer',

    '&:active' : {
        backgroundColor: '#5D6D7E',   
    }
});