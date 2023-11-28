import { styled } from "@stitches/react"

export const Container = styled("div", {
    display: "flex",
    alignItems: 'center',
    flexDirection: 'column',
    paddingLeft: '1rem',
    paddingRight: '1rem',

    '.avisoInicial':{
        backgroundColor:'#FEF9E7',
        padding: '1rem',
        minWidth: '900px',
        maxHeight: '375px',
        border: '1px solid #F7DC6F',
        fontWeight: '500'
    }
});