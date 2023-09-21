import { styled } from "@stitches/react"

export const FooterStyle = styled("footer", {
    display: 'grid',
    gridArea: "footer",
    background: '#13293d',
    justifyContent: 'center',
    alignItems: 'center',
    height: '45px',

    "p":{
        fontSize: '0.8rem',
        fontWeight: 'normal',
        color : "#ffffff"  
    }
});
