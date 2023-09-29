import { useEffect, useState } from "react";
import { TableGrid, TableGridMenu, Button } from "./style";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

export default function DataGrid({ columns, rows, paginacao, pagina, left, right}) {
  const _paginasCorrente = paginacao.total < paginacao.paginasCorrentes ? paginacao.total : paginacao.paginasCorrentes; 
  const _paginasTotal = paginacao.totalPaginas == (paginacao.paginasCorrentes - 1) ? (paginacao.paginasCorrentes - 1) : paginacao.total;
  const _pagina = pagina == 1 ? 1 : (((pagina * 100) - 100) + 1);

  const navigate = useNavigate();

  const [ id, setId] = useState(0)

  const handleVisualizar = (id) => {
      setId(id);
      navigate(`/TesteOptico/Visualizar/${id}`);
  }
  
  return (
    <>
      <TableGridMenu>
        <div className="total"><p>{paginacao.total} Registros</p></div>
        <p>{_paginasCorrente == 0 ? 0 : _pagina}</p>
        <p>&nbsp;-&nbsp;</p>
        <p>{_paginasCorrente == 100 ? 100 : _paginasCorrente}</p>
        <p>&nbsp;de&nbsp;</p>
        <p>{_paginasTotal}</p>
        {_pagina > 100 ? <FaAngleLeft onClick={left} className="leftAngle" /> : <FaAngleLeft style={{color:'#AEB6BF', fill:'#AEB6BF', cursor:'default'}} className="leftAngle" />}
        {_paginasCorrente < _paginasTotal ? <FaAngleRight onClick={right} className="rightAngle" /> : <FaAngleRight style={{color:'#AEB6BF', fill:'#AEB6BF', cursor:'default'}} className="rightAngle" />}
      </TableGridMenu>
      <TableGrid>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.name}>{column.name}</th>
            ))}
            <th># AÇÕES #</th> 
          </tr>
        </thead>
        <tbody>
          {_paginasCorrente == 0 ? (<tr><td colSpan={12}>Nenhum Resultado.</td></tr>) : (
            rows.map((row, rowIndex) => (         
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={column.key}>{row[column.key] || "-"}</td>
                ))}
                 <td>
                  {/* Botão Detalhe */}
                  <Button onClick={() => handleVisualizar(row.id)} >Visualizar</Button>
                  {/* Botão Editar */}
                  <Button >Editar</Button>
                  {/* Botão Excluir */}
                  <Button >Excluir</Button>
                </td>
              </tr>
            ))
            )}
        </tbody>
      </TableGrid>
    </>
  );
}
