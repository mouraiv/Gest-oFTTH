import { styled } from "@stitches/react";

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

export const ButtonImport = styled("button", {
    backgroundColor: '#13293d',
    border: '1px solid #5D6D7E',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    width: '100px',
    height: '30px',
    color: '#ffffff',
    cursor: 'pointer',
    marginLeft: '1rem',


    '&:active' : {
        backgroundColor: '#5D6D7E',   
    }
});

export const Filter = styled("div", {
    display: "flex",
    backgroundColor: '#D6DBDF',
    width: '100%',
    fontSize: '0.8rem',
    fontWeight: '700',
    paddingBottom: '0.7rem',
    position: 'relative'
});

export const SubMenu = styled("div", {
    display: 'flex',
    border: '0',
    width:'100%',
    marginBottom: '0.5rem',
});
