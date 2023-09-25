import { TableGrid, TableGridMenu } from "./style";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

export default function DataGrid({ columns, rows, paginacao, pagina, left, right }) {
  const _paginasCorrente = paginacao.total < paginacao.paginasCorrentes ? paginacao.total : paginacao.paginasCorrentes; 
  const _paginasTotal = paginacao.totalPaginas == (paginacao.paginasCorrentes - 1) ? (paginacao.paginasCorrentes - 1) : paginacao.total;
  const _pagina = pagina == 1 ? 1 : (((pagina * 100) - 100) + 1);
  return (
    <>
      <TableGridMenu>
        <div className="total"><p>{paginacao.total} Registros</p></div>
        <p>{_paginasCorrente == 0 ? 0 : _pagina}</p>
        <p>&nbsp;-&nbsp;</p>
        <p>{_paginasCorrente == 100 ? 100 : _paginasCorrente}</p>
        <p>&nbsp;de&nbsp;</p>
        <p>{_paginasTotal}</p>
        {_pagina > 100 ? <FaAngleLeft onClick={left} className="leftAngle" /> : <FaAngleLeft style={{color:'#AEB6BF', fill:'#AEB6BF', cursor:'default'}} className="rightAngle" />}
        {_paginasCorrente < _paginasTotal ? <FaAngleRight onClick={right} className="rightAngle" /> : <FaAngleRight style={{color:'#AEB6BF', fill:'#AEB6BF', cursor:'default'}} className="rightAngle" />}
      </TableGridMenu>
      <TableGrid>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.name}>{column.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {_paginasCorrente == 0 ? (<tr><td colSpan={12}>Nenhum Resultado.</td></tr>) : (
            rows.map((row, rowIndex) => (         
              <tr key={rowIndex}>
                <td>{pagina == 1 ? rowIndex + 1 : (((rowIndex + 1) + (pagina * 100)) - 100)}</td>
                {columns.slice(1).map((column) => (
                  <td key={column.key}>{row[column.key] || "-"}</td>
                ))}
              </tr>
            ))
            )}
        </tbody>
      </TableGrid>
    </>
  );
}
