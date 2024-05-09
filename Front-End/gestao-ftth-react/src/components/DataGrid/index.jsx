import { useState } from "react";
import { Container, TableGridMenu, Button } from "./style";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { useNavigate, Link } from 'react-router-dom';
import DialogAlert from "../../components/Dialog";
import { DeleteTesteOptico } from "../../api/testeOptico";
import { formatarNumero } from "../../util/formatarNumeros";

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

  const navigate = useNavigate();
  
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState();
  const [analseDelete, setAnaliseDelete] = useState();

  async function fetchDelete(){
    try {
      atualizar(false)
      if(id !== undefined){
        await DeleteTesteOptico(id);
      }
    } catch (error) {
      atualizar(true);
      
    }finally{
      atualizar(true);
    }
    
  }

  const handleVisualizar = (id, idNetwin, survey) => {
    const viewHTML = `/TesteOptico/Visualizar/${id ?? null}/${idNetwin ?? null}/${survey ?? null}`;
    window.open(viewHTML, viewHTML);
  }

  const HandleEditar = (id) => {
    navigate(`/TesteOptico/Editar/${id ?? null}`);
  }

  const HandleExcluir = (id, analise) => {
    setId(id);
    setVisible(true);

    if(analise.length == 0) {
      setAnaliseDelete(false);
    }else{
      setAnaliseDelete(true);
    }  
  }

  const ExcluirFecth = async () => {
    await fetchDelete();
    setVisible(false);
  }

  function getNestedValue(obj, key) {
    const keys = key.split('.');
    return keys.reduce((acc, currentKey) => (acc && acc[currentKey] ? acc[currentKey] : undefined), obj);
  }

  const mesAbreviado = (numeroMes) => {
    const meses = {
      '01': 'JAN',
      '02': 'FEV',
      '03': 'MAR',
      '04': 'ABR',
      '05': 'MAI',
      '06': 'JUN',
      '07': 'JUL',
      '08': 'AGO',
      '09': 'SET',
      '10': 'OUT',
      '11': 'NOV',
      '12': 'DEZ'
    };
    return meses[numeroMes] || 'ERR'; // Retorna a versão abreviada correspondente ou 'DESC' se o número do mês não for reconhecido
  };
  
  return (
    <>
    <Container>
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
          <div className="total">
            <p>{formatarNumero(paginacao.total)} Registros {paginacao.totalUms > 0 ? `[Total Ums: ${formatarNumero(paginacao.totalUms)}]` : ""}</p>
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
                  {row.id_Associacao === '2' && row.cod_Survey !== '-' &&
                    <tr>
                      <td className="td_ass" colSpan={15}><a>{`SURVEY COM MULTIPLAS ASSOCIAÇÕES | DATA DA ASSOCIAÇÃO: ${row.dataAssociacao ?? ""}`}</a></td>  
                    </tr>
                  }
                <tr>
                <td className="th_column" style={{width: '2%'}}>UF</td>
                <td className="th_column" style={{width: '7%'}}>BASE. ACUM</td>  
                {columns.map((column) => (
                <td className="th_column" key={column.name} style={{width : column.width}}>{column.name}</td>
                ))}
                </tr>
                <tr>
                <td>{row.uf}</td>
                <td>{row.anoMes !== null ? `(${row.anoMes.slice(-2)}) ${mesAbreviado(row.anoMes.slice(4, 6))}/${row.anoMes.slice(0, -4)}` : null}</td>  
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
                  <td className="th_column" colSpan={columns.length + 3}>ENDEREÇO</td>
                </tr>
                <tr>
                  <td colSpan={columns.length + 1}>
                  <div>{row.cod_Survey === '-' ? "-" : `${row.logradouro ?? "-"}, ${row.numeroFachada ?? "-"} - ${row.bairro ?? "-"}, ${row.municipio ?? "-"} - ${row.cep ?? "-"}, ${row.materialRede.nomeFederativa_Mt ?? "-"} - ${row.uf ?? "-"}`}</div>
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
