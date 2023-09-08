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
    height: '200px',
    border: '1px solid',
    borderColor: '#000000'
});

export const Input = styled("input", {
    width: '250px',
    height: '27px',
    border: '1px solid',
    borderColor: '#13293d',
    marginBottom: '0.5rem'
});

export const Button = styled("button", {
    width: '258px',
    height: '30px',
    marginBottom: '2rem',
    background: '#13293d',
    color: '#ffffff',
    border: 0,
});

export const Title = styled("p", {
    margin: '0.8rem',
    fontWeight: '700',
    padding: '0.5rem',
    textAlign: 'center'
});