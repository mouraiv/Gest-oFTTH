import { Container, TableGridMenu, Button } from "../style";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { formatarNumero } from "../../../util/formatarNumeros";

export default function DataGrid({ 
  columns, 
  rows, 
  paginacao, 
  pagina, 
  left, 
  right,
  atualizar
}) {
  const _paginasCorrente = paginacao.total < paginacao.paginasCorrentes ? paginacao.total : paginacao.paginasCorrentes; 
  const _paginasTotal = paginacao.totalPaginas == (paginacao.paginasCorrentes - 1) ? (paginacao.paginasCorrentes - 1) : paginacao.total;
  const _pagina = pagina == 1 ? 1 : (((pagina * 100) - 100) + 1);

  const handleVisualizar = (id, idNetwin, survey) => {
    const viewHTML = `/TesteOptico/Visualizar/${id ?? null}/${idNetwin ?? null}/${survey ?? null}`;
    window.open(viewHTML, viewHTML);
  }

  const analiseState = (analise) => {
    let reteste = analise?.map(value => value.dataAnalise)
                   .filter((date, index, self) => self.indexOf(date) === index);

      if(analise != undefined) {
        if(reteste.length > 1){
          return 'RE-TESTE';
        
          }else{
          return 'TESTADO';
        }
        
      }else{
        return '--';
        
      }
  }

  function getNestedValue(obj, key) {
    const keys = key.split('.');
    return keys.reduce((acc, currentKey) => (acc && acc[currentKey] ? acc[currentKey] : undefined), obj);
  }
  
  return (
    <>
    <Container>
        <TableGridMenu>
          <div className="total">
            <p>{formatarNumero(paginacao.total)} Registros</p>
          </div>
          <p>{_paginasCorrente == 0 ? 0 : formatarNumero(_pagina)}</p>
          <p>&nbsp;-&nbsp;</p>
          <p>{_paginasCorrente == 100 ? 100 : formatarNumero(_paginasCorrente)}</p>
          <p>&nbsp;de&nbsp;</p>
          <p>{formatarNumero(_paginasTotal)}</p>
          {_pagina > 100 ? <FaAngleLeft onClick={left} className="leftAngle" /> : <FaAngleLeft style={{color:'#AEB6BF', fill:'#AEB6BF', cursor:'default'}} className="leftAngle" />}
          {_paginasCorrente < _paginasTotal ? <FaAngleRight onClick={right} className="rightAngle" /> : <FaAngleRight style={{color:'#AEB6BF', fill:'#AEB6BF', cursor:'default'}} className="rightAngle" />}
        </TableGridMenu>
          <table id="tableInfo">
          <tbody>
            {rows.length === 0 ? (<tr><td colSpan={columns.length + 1}>Nenhum Resultado.</td></tr>) : (
              rows.map((row, rowIndex) => ( 
                <>     
                <tr key={rowIndex} 
                style={{borderTop: '10px solid WhiteSmoke'}}>
                 <td colSpan={columns.length + 1} onClick={() => handleVisualizar(row.id, row.id_MaterialRede, row.cod_Survey)}> 

                  <table id="tableContainer">
                  <tbody>
                  <tr>
                  <td colSpan={columns.length + 1} style={
                    row.sel === 0 ? {
                      backgroundColor: '#D4EFDF',
                      color: '#145A32',
                      border: '1px solid #145A32'
                      
                  }:{ backgroundColor:'#c9c9c9', border: '1px solid #13293d' }
                  }>  {row.sel === 1  ? "VALIDAÇÃO PENDENTE" :  "VALIDADO" }
                  </td>
                </tr>    
                <tr>
                <td className="th_column">STATUS</td>
                {columns.map((column) => (
                <td className="th_column" key={column.name} style={{width : column.width}}>{column.name}</td>
                ))}
                </tr>
                <tr>
                <td>{analiseState(row.getAnalise)}</td>
                  {columns.map((column) => (
                    <td key={column.key}
                      style={{width : column.width}}                   >
                      {column.key.includes('.') 
                      ? getNestedValue(row, column.key) || "-"
                      : row[column.key] || "-"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td colSpan={columns.length + 1}>
                  
                  </td>
                    </tr>
                  </tbody>
                  </table>

                  </td>  
                </tr>
                </> 
              ))
              )}
          </tbody>
          </table>
        </Container>
    </>
  );
}
