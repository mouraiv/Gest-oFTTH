import { styled } from "@stitches/react"

export const Container = styled("div", {
    display: "grid",
    justifyContent: 'center'
});

export const Div = styled("div", {
	display:"flex",
    background: '#F8F9F9',
    justifyContent: 'center',
    width: '300px',
    border: '1px solid',
    borderColor: '#000000',

    "label":{
        fontSize: '0.8rem',
        fontWeight: '600',
        color: '#7F8C8D'
    }
});

export const Input = styled("input", {
    width: '250px',
    height: '27px',
    paddingLeft: '0.3rem',
    paddingRight: '0.3rem',
    border: '1px solid',
    borderColor: '#13293d',
    marginBottom: '0.5rem',
    fontWeight: '500'
});

export const Button = styled("button", {
    width: '252px',
    height: '30px',
    marginTop: '1rem',
    marginBottom: '2rem',
    background: '#13293d',
    color: '#ffffff',
    border: 0,
    cursor: 'pointer',

    '&:active':{
        backgroundColor: '#5D6D7E',
    }
});

export const Title = styled("p", {
    margin: '0.3rem',
    fontWeight: '700',
    padding: '0.5rem',
    textAlign: 'center'
});