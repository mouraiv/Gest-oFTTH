import { useState } from "react";
import { Container, TableGridMenu, Button } from "../style";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function DataGrid({ 
  columns, 
  rows, 
  paginacao, 
  pagina, 
  left, 
  right,
  atualizar
}) {
  const _paginasCorrente = 1; //paginacao.total < paginacao.paginasCorrentes ? paginacao.total : paginacao.paginasCorrentes; 
  const _paginasTotal = pagina; //paginacao.totalPaginas == (paginacao.paginasCorrentes - 1) ? (paginacao.paginasCorrentes - 1) : paginacao.total;
  const _pagina = pagina ;//pagina == 1 ? 1 : (((pagina * 100) - 100) + 1);

  const _rows = () => {
    return rows.map((row, rowIndex) => {

    });
  }

  const navigate = useNavigate();
  
  function getNestedValue(obj, key) {
    const keys = key.split('.');
    return keys.reduce((acc, currentKey) => (acc && acc[currentKey] ? acc[currentKey] : undefined), obj);
  }
  console.log(rows)
  
  return (
    <>
    <Container>
        <TableGridMenu>
          <div className="total">
            <p>{_pagina} Registros</p>
          </div>
          <p>{_paginasCorrente == 0 ? 0 : _paginasCorrente}</p>
          <p>&nbsp;-&nbsp;</p>
          <p>{_paginasCorrente == 100 ? 100 : _pagina}</p>
          <p>&nbsp;de&nbsp;</p>
          <p>{_paginasTotal}</p>
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
                  {row.id_Associacao === '2' && row.cod_Survey !== '-' &&
                    <tr>
                      <td className="td_ass" colSpan={15}><a>{`SURVEY COM MULTIPLAS ASSOCIAÇÕES | DATA DA ASSOCIAÇÃO: ${row.dataAssociacao ?? ""}`}</a></td>  
                    </tr>
                  }
                <tr>
                <td className="th_column" width={'15%'}>ÚLTIMO ACESSO</td>
                <td className="th_column" width={'5%'}>STATUS</td>
                <td className="th_column" width={'5%'}>ACESSO</td> 
                {columns.map((column) => (
                  <> 
                <td className="th_column" key={column.name} style={{width : column.width}}>{column.name}</td>
                </>
                ))}
                </tr>
                <tr>
                <td>{format(new Date(row.statusLogin?.loginDate ?? "2024-04-10T09:26:28.66"), "dd/MM/yyyy HH'h':mm'm'")}</td>
                <td style={row.statusLogin?.status === 2 ? {fontWeight: '800', color: 'green'} : {fontWeight: '800', color: 'red'}}>{row.statusLogin?.status === 2 ? "Online" : "Offline"}</td>
                <td style={{fontWeight: '800'}}>{row.publico === 1 ? "Local" : "Publico"}</td>
                  {columns.map((column) => (
                    <td key={column.key}
                      style={{width : column.width}}>
                      {column.key.includes('.') 
                      ? getNestedValue(row, column.key) || "-"
                      : row[column.key] || "-"}
                    </td>
                  ))}
                </tr>
                <tr>
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
