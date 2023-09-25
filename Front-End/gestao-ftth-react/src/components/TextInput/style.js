import { styled } from "@stitches/react"

export const FormGroup = styled("div", {
    display: "flex",
    flexDirection: 'column',
});

export const Input = styled("input", {
    marginLeft: '1rem',
    marginTop: '0.2rem',
    height: '6px',
    width: '130px',
    padding: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase'
});

export const Label = styled("label", {
    marginLeft: '1.1rem',
    marginTop: '0.5rem'
});

