import { useEffect, useState } from "react";
import { TableGrid, TableGridMenu, Button } from "./style";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import DialogAlert from "../../components/Dialog";
import { deleteTesteOptico } from "../../api/testeOptico";

export default function DataGrid({ 
  columns, 
  rows, 
  paginacao, 
  pagina, 
  left, 
  right,
  sel,
  atualizar
}) {
  const _paginasCorrente = paginacao.total < paginacao.paginasCorrentes ? paginacao.total : paginacao.paginasCorrentes; 
  const _paginasTotal = paginacao.totalPaginas == (paginacao.paginasCorrentes - 1) ? (paginacao.paginasCorrentes - 1) : paginacao.total;
  const _pagina = pagina == 1 ? 1 : (((pagina * 100) - 100) + 1);

  const navigate = useNavigate();
  
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState();
  const [analseDelete, setAnaliseDelete] = useState(0);

  async function fetchDelete(){
    if(id !== undefined){
        const data = await deleteTesteOptico(id);
    }
  }

  const handleVisualizar = (id) => {
    setId(id);
    navigate(`/TesteOptico/Visualizar/${id}`);
  }

  const HandleEditar = (id) => {
    setId(id);
    navigate(`/TesteOptico/Editar/${id}`);
  }

  const HandleExcluir = (id, analise) => {
    setId(id);
    setVisible(true);
    setAnaliseDelete(analise.length);
  }

  const ExcluirFecth = async () => {
    await fetchDelete();
    setVisible(false);
    atualizar();
  }

  return (
    <>
    <DialogAlert 
            visibleDiag={visible} 
            visibleHide={() => setVisible(false)}
            header={<h4>Atenção</h4>}
            colorType={'#ff0000'}
            ConfirmaButton={analseDelete > 0 ? false : true}
            textCloseButton={analseDelete > 0 ? 'OK' : 'Cancelar'}
            text={
              <>
              { analseDelete > 0 ? (
                <>
                <p>Esse teste não pode ser excluído!</p>
                <p></p>
                <p>O teste possuí analises associadas.</p>
                </>

              ):(
                <>
                <p>Esta ação é irreversível</p>
                <p></p>
                <p>Tem certeza que gostaria de excluir esse teste?</p>
                </>
              )
              }
              </>
            }
            buttonConfirmar={() => ExcluirFecth()} 
       />
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
                    <Button onClick={() => handleVisualizar(row.id)} >Visualizar</Button>
                    { row.sel == 1 &&
                    <>
                      <Button onClick={() => HandleEditar(row.id)} >Editar</Button>
                      <Button onClick={() => HandleExcluir(row.id, row.getAnalise)} >Excluir</Button>
                    </>
                    }
                  </td>
                </tr>
              ))
              )}
          </tbody>
        </TableGrid>
    </>
  );
}
