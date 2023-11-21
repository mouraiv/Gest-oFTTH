import { Drop, FormGroup } from "./style";

export default function DropBox({label, event, lista, text, valueDefaut, width, height}) {
      return (
        <>
          <FormGroup>
            <label>{label}</label>
            <Drop onChange={event} value={text} style={{width:`${width}`, height:`${height}`}}>
              {lista.length !== 0 ? (
                  valueDefaut === '' ? (
                    <>
                    <option value="">- Selecionar -</option>
                    {lista
                      .map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                      </>
                  ) : (
                    <>
                    <option value={valueDefaut}>{valueDefaut}</option>
                  {lista
                    .filter(item => item !== valueDefaut && item !== '') 
                    .map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                    </>
                  )
              ) : (
                  <option value="">Carregrando...</option>
              )}
            </Drop>
          </FormGroup>
        </>
      )
  }
  