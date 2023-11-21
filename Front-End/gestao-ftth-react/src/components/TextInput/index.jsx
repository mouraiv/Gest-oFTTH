import { Input, Label, FormGroup } from "./style";

export default function TextInput({label, event, text, placeholder, width, height }) {
      return (
        <>
          <FormGroup>
          <Label>{label}</Label>
          <Input width={width} height={height} onChange={event} value={text} placeholder={placeholder} />
          </FormGroup>
        </>
      )
  }
  