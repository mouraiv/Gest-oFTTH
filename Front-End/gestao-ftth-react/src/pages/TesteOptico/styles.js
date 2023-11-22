import { styled } from "@stitches/react";

export const Filter = styled("div", {
    display: "flex",
    backgroundColor: '#D6DBDF',
    height: '60px',
    width: '100%',
    fontSize: '0.8rem',
    fontWeight: '700',
    paddingBottom: '0.7rem',
});

export const SubMenu = styled("div", {
    display: 'flex',
    border: '0',
    width:'100%',
    marginBottom: '0.5rem',
});

export const ButtonImport = styled("button", {
    backgroundColor: '#13293d',
    border: '1px solid #5D6D7E',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    width: '130px',
    height: '30px',
    color: '#ffffff',
    cursor: 'pointer',


    '&:active' : {
        backgroundColor: '#5D6D7E',   
    }
});

