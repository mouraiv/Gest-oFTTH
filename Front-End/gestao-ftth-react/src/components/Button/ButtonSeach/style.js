import { styled } from "@stitches/react"

export const Container = styled("div", {
    marginTop: '1.7rem',
    marginLeft: '1rem',

    "button":{
        backgroundColor: '#13293d',
        border: '1px solid #5D6D7E',
        borderRadius: '0.3rem',
        fontSize: '0.8rem',
        fontWeight: '500',
        width: '80px',
        height: '27px',
        color: '#ffffff'
    },
    "button:active":{
        backgroundColor: '#5D6D7E',
    }
});