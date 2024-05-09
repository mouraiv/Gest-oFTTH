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
                style={{borderTop: '15px solid WhiteSmoke'}}>
                 <td colSpan={columns.length + 1}> 

                  <table id="tableContainer">
                  <tbody>  
                <tr>
                {columns.map((column) => (
                <td className="th_column" key={column.name} style={{width : column.width, borderTop: '4px solid',}}>{column.name}</td>
                ))}
                </tr>
                <tr>
                  {columns.map((column) => (
                    <td key={column.key}
                      style={{width : column.width, borderTop: '1px solid', padding : '0.3rem'}}                   >
                      {column.key.includes('.') 
                      ? getNestedValue(row, column.key) || "-"
                      : row[column.key] || "-"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td colSpan={5} className="th_column">CODIGO. VIABILIDADE</td>
                  <td colSpan={5} className="th_column">TIPO VIABILIDADE</td>
                  <td colSpan={5} className="th_column">PENDÊNCIA VIABILIDADE</td>
                  </tr>
                  <tr style={{padding : '0.3rem', fontSize: '0.8rem', borderTop: '1px solid'}}>
                  <td colSpan={5}>{row.codNetwin}</td>
                  <td colSpan={5}>{row.statusNetwin}</td>
                  <td colSpan={5}>{row.pendenciaViab}</td>
                  </tr>
                <tr>
                  <td colSpan={columns.length + 1} style={{padding : '0.3rem', fontWeight: '750', borderTop: '1px dotted #D6DBDF'}}>
                  {row.endereco}
                  </td>
                  </tr>
                  <tr>
                  <td className="th_column">DATA ANÁLISE</td>
                  <td className="th_column">TIPO</td>
                  <td className="th_column">STATUS</td>
                  <td colSpan={2} className="th_column">ANALISTA</td>
                  <td colSpan={2} className="th_column">ESTADO OPERACIONAL</td>
                  <td colSpan={3} className="th_column">GRUPO CONTROLE</td>
                  <td colSpan={2} className="th_column">ESTADO CONTROLE</td>
                  <td className="th_column">POSIÇÃO DGO</td>
                  <td className="th_column">FIBRA DGO</td>
                  <td className="th_column">PORTAS OCUPADAS</td>
                  </tr>
                  <tr style={{padding : '0.3rem', fontSize: '0.7rem', fontWeight: '750', borderTop: '1px solid'}}>
                  <td>{row.dataAnalise}</td>
                  <td style={{fontWeight: '750'}}>{row.tipo}</td>
                  <td>{row.status}</td>
                  <td colSpan={2}>{row.analista}</td>
                  <td colSpan={2} >{row.estadoOperacional}</td>
                  <td colSpan={3}>{row.grupoControle}</td>
                  <td colSpan={2}>{row.estadoControle_Mt}</td>
                  <td>{row.posicaoDGO}</td>
                  <td>{row.fibraDGO}</td>
                  <td>{row.portasOcupadas}</td>
                  </tr>
                  <tr>
                  <td colSpan={columns.length + 1} style={{padding : '0.3rem', fontWeight: '750', borderTop: '1px dotted #D6DBDF'}}>
                  {row.obsAnalise}
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
