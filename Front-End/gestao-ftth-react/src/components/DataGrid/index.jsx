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
  const [analseDelete, setAnaliseDelete] = useState();

  async function fetchDelete(){
    if(id !== undefined){
        await deleteTesteOptico(id);
    }
  }

  const handleVisualizar = (id, idNetwin, survey) => {
    navigate(`/TesteOptico/Visualizar/${id}/${idNetwin}/${survey}`);
  }

  const HandleEditar = (id) => {
    navigate(`/TesteOptico/Editar/${id}`);
  }

  const HandleExcluir = (id, analise) => {
    setId(id);
    setVisible(true);

    if(analise == null) {
      setAnaliseDelete(false);
    }else{
      setAnaliseDelete(true);
    }   
  }

  const ExcluirFecth = async () => {
    await fetchDelete();
    setVisible(false);
    atualizar();
  }

  function getNestedValue(obj, key) {
    const keys = key.split('.');
    return keys.reduce((acc, currentKey) => (acc && acc[currentKey] ? acc[currentKey] : undefined), obj);
  }
  
  function formatarNumero(numero) {
    // Converte o número para uma string
    const numeroString = numero.toString();
  
    // Divide a string em grupos de 3 caracteres
    const grupos = [];
    for (let i = numeroString.length; i > 0; i -= 3) {
      grupos.unshift(numeroString.substring(Math.max(0, i - 3), i));
    }
  
    // Junta os grupos usando o ponto como separador e retorna
    return grupos.join('.');
  }

  return (
    <>
    <DialogAlert 
            visibleDiag={visible} 
            visibleHide={() => setVisible(false)}
            header={<h4>Atenção</h4>}
            colorType={'#ff0000'}
            ConfirmaButton={analseDelete ? false : true}
            textCloseButton={analseDelete ? 'OK' : 'Cancelar'}
            text={
              <>
              { analseDelete ? (
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
          <div className="total"><p>{formatarNumero(paginacao.total)} Registros</p></div>
          <p>{_paginasCorrente == 0 ? 0 : formatarNumero(_pagina)}</p>
          <p>&nbsp;-&nbsp;</p>
          <p>{_paginasCorrente == 100 ? 100 : formatarNumero(_paginasCorrente)}</p>
          <p>&nbsp;de&nbsp;</p>
          <p>{formatarNumero(_paginasTotal)}</p>
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
            {_paginasCorrente == 0 ? (<tr><td colSpan={13}>Nenhum Resultado.</td></tr>) : (
              rows.map((row, rowIndex) => (         
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.key.includes('.') 
                      ? getNestedValue(row, column.key) || "-"
                      : row[column.key] || "-"}
                    </td>
                  ))}
                  <td style={{whiteSpace: 'nowrap'}}>
                    <Button onClick={() => handleVisualizar(row.id, row.id_MaterialRede, row.cod_Survey)} >Visualizar</Button>
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
