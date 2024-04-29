import { Container, TableGridMenu, Button } from "../DataGridControleCampo/style";
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
          <thead>
          <tr>
            {columns.map((column) => (
              <th className="th_column" key={column.name} style={{width : column.width}}>{column.name}</th>
            ))}
          </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (<tr><td colSpan={columns.length + 1}>Nenhum Resultado.</td></tr>) : (
              rows.map((row, rowIndex) => ( 
                <>     
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={column.key}
                      style={{width : column.width}}                   >
                      {column.key.includes('.') 
                      ? getNestedValue(row, column.key) || "-"
                      : row[column.key] || "-"}
                    </td>
                  ))}
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
