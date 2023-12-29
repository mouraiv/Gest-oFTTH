/* eslint-disable react/prop-types */
import { Drop, FormGroup } from "./style";

export default function DropBox({label, event, lista, text, valueDefaut, width, height, disable}) {
      return (
        <>
          <FormGroup>
            <label>{label}</label>
            <Drop onChange={event} value={text} style={{width:`${width}`, height:`${height}`}} disabled={disable}>
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
                  <option value="">Carregando...</option>
              )}
            </Drop>
          </FormGroup>
        </>
      )
  }
  