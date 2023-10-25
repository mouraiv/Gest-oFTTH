import { styled } from "@stitches/react"

export const Container = styled("div", {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '.formulario' : {
        backgroundColor: '#D6DBDF',
        margin: '1rem',
        padding: '0.8rem'
    },

    'label':{
        fontSize: '0.7rem',
        fontWeight: '700'
    },

    'textarea': {
        height: '40px',
        resize: 'none',
        border: '1px solid',
        borderColor: '#13293d',
        padding: '0.3rem',
        fontWeight: '600'
    }
});

export const Input = styled("input", {
    height: '12px',
    border: '1px solid',
    borderColor: '#13293d',
    padding: '0.3rem',
    fontWeight: '600'
});