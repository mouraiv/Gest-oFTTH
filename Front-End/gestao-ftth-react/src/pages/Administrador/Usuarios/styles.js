import { styled } from "@stitches/react";

export const SubMenu = styled("div", {
    display: 'flex',
    border: '0',
    width:'100%',
    marginBottom: '0.5rem',
});

export const ButtonImagem = styled("button", {
    border: '1px solid #5D6D7E',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    marginLeft:'0.5rem',
    marginBottom: '0.7rem',
    width: '100px',
    height: '30px',
    color: '#17202A',
    cursor: 'pointer',

    '&:active' : {
        backgroundColor: '#D6DBDF',   
    }
});