import { Input, Label, FormGroup } from "./style";

export default function TextInput({label, event, text, placeholder}) {
      return (
        <>
          <FormGroup>
          <Label>{label}</Label>
          <Input onChange={event} value={text} placeholder={placeholder} />
          </FormGroup>
        </>
      )
  }
  