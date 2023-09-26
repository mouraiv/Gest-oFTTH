import { Drop, Label, FormGroup } from "./style";

export default function DropBox({label, event, lista, text}) {
      return (
        <>
          <FormGroup>
          <Label>{label}</Label>
          <Drop onChange={event} value={text}>
          { lista.length !== 0 ? ( 
          <>
          <option value="">- Selecionar -</option>
            {lista.map((item, index) => (
                <option key={index} value={item}>
                {item}
                </option>
            ))}
            </>
            ):(<option value="">Carregando...</option>)
            }
          </Drop>
          </FormGroup>
        </>
      )
  }
  