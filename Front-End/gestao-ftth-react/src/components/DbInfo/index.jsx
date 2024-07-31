import React, {useState, useEffect, useRef} from "react";
import axios from 'axios';
import { InfoData, InputImport, ButtonUpload, ImportArea } from "./styles";
import { GetInfo, UpdateInfo } from "../../api/info";
import {FazerUploadMultiplaAssociacao, FazerUploadEnderecoTotal} from "../../api/enterecoTotais"
import { FaDatabase } from 'react-icons/fa6';
import DialogAlert from "../../components/Dialog";
import { useCancelToken } from '../../contexts/CancelTokenContext';
import ProgressComponentBase from '../../components/progress/ProgressComponentBase';
import ProgressComponentSleep from '../../components/progress/progressSleep/ProgressComponentSleep';

export default function InfoDataBase() {
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState();
    const [id, setId] = useState();
    const [atualizar, setAtualizar] = useState(0);
    const [carregarExport, setCarregarExport] = useState(false);
    const [visible, setVisible] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const[nameBase, setNameBase] = useState("");
    const [file, setFile] = useState(null);
    const [checkedCheckbox, setCheckedCheckbox] = useState("");
    const [dataAtual] = useState(new Date());

    const cancelToken = useCancelToken();
    const _dataAtual = dataAtual.toISOString();

    async function fecthInfo(){
        try {
            const detalheInfo = await GetInfo();

            if(detalheInfo.status == 200) {
                setInfo(detalheInfo.data);
                
            }

        } catch (error) {
            setLoading(true);
            
        } finally {
            setLoading(true);
        }
    }

    async function FetchUpdateInfo(indice, date, id) {
        try {
            const infoView = info.filter(p => p.id_info === id);
            const infoData = {
                id_info: id,
                ...infoView[0]
            }

            if(!date){
                infoData.atualizar = indice;

            }else{
                infoData.dataImport = _dataAtual;
                infoData.atualizar = indice;
            }

            await UpdateInfo(infoData);

        } catch (error) {
            setMensagem(`Erro ao atualizar Info.`)
            setLoading(false);

        } finally {
            setLoading(false);
            fecthInfo();

            
        }
    }

    async function FetchUpaloadBase(arquivo){
        try {
          cancelToken.current = axios.CancelToken.source();
  
            if(checkedCheckbox === "Multipla Associação"){
                console.log("Multipla Associação")
                const importar = await FazerUploadMultiplaAssociacao(arquivo, cancelToken.current.token);
        
                if(importar.status == 200) {
                    setFile(null);
                    setCarregarExport(false);
                    setMensagem(importar.data);
                    FetchUpdateInfo(0, true, id)
                    
                }

            }else if(checkedCheckbox === "Endereço Total"){
                const importar = await FazerUploadEnderecoTotal(arquivo, cancelToken.current.token);
        
                if(importar.status == 200) {
                    setFile(null);
                    setCarregarExport(false);
                    setMensagem(importar.data);
                    FetchUpdateInfo(0, true, id)
                    
                }
            }
          
        } catch (error) {
            if(error.message === "Requisição cancelada."){
                setFile(null);
                setCarregarExport(false);
                setMensagem("Requisição cancelada.");
                FetchUpdateInfo(0, false, id)
                setLoading(true);
            }else{
                setFile(null);
                setCarregarExport(false);
                setMensagem(error.request.responseText);
                FetchUpdateInfo(0, false, id)
                setLoading(true);
            }
               
        } finally {
          setLoading(true);
        }
    }

    // Função para cancelar a solicitação
    const CancelarSolicitacao = (id) => {
            setFile(null);
            setAtualizar(0);
            setCarregarExport(false);
            FetchUpdateInfo(0, false, id);
            cancelToken.current.cancel("Requisição cancelada."); 
    }

    const handleUpdate = (base, id, atualizar) => {
        fecthInfo();
        setMensagem("");
        setId(id);
        setNameBase(base);
        setAtualizar(atualizar);
        setVisible(true);
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };

      const handleUpload = () => {
        if(file){ 
          setCarregarExport(true);
          FetchUpaloadBase(file)
          FetchUpdateInfo(1, false, id);
          setLoading(false);
          setMensagem("");

        }else{
          setMensagem("Nenhum arquivo selecionado.");
          setVisible(true);
        }
      };

      const handleCheckboxChange = (checkboxName) => {
        if (checkedCheckbox === checkboxName) {
            checkedCheckbox === "" ?? checkboxName;
        } else {
            setCheckedCheckbox(checkboxName);
        }
      };

    useEffect(() => {
        fecthInfo();
        setCheckedCheckbox("Endereço Total");
    },[])

      return (
        <>
        <DialogAlert 
                    visibleDiag={visible} 
                    visibleHide={() => {
                        if(!carregarExport && atualizar === 0){
                            setVisible(false);
                            setMensagem("");
                            setFile(null);

                        }else{
                            CancelarSolicitacao(id);
                            
                        }
                    }}
                    abilityMinimizar={!carregarExport && atualizar === 0 ? false : true}
                    minimizar={() => setVisible(false)}
                    header={<h5>Atualização: {nameBase}</h5>}
                    colorType={carregarExport ? null : '#13293d'}
                    ConfirmaButton={false}
                    CancelaButton={false}
                    textCloseButton={!carregarExport && atualizar === 0 ? 'Fechar' : 'Cancelar'}
                    text={
                        <>
                            { !carregarExport && atualizar === 0 &&
                                <>
                                <div style={nameBase === "Endereços Totais" ? 
                                {display: 'flex',flexDirection: 'column', height:'70px'} : {height:'40px'}}>
                                { nameBase === "Endereços Totais" &&
                                    <>
                                    <div style={{marginBottom: '0.5rem'}}>
                                        <label style={{marginLeft: "0.5rem"}}>
                                        <input
                                        type="checkbox"
                                        checked={checkedCheckbox === 'Endereço Total'}
                                        /*onChange={() => handleCheckboxChange('Endereço Total')}*/
                                        />
                                        {" Endereço Total"}
                                    </label>
                    
                                    <label style={{marginLeft: "0.5rem"}}>
                                        <input
                                        type="checkbox"
                                        checked={checkedCheckbox === 'Multipla Associação'}
                                        /*onChange={() => handleCheckboxChange('Multipla Associação')}*/
                                        />
                                        {" Multipla Associação"}
                                    </label>
                                    </div>
                                  </>
                                }
                                {checkedCheckbox !== "" &&
                                <>
                                {id === 1 || id === 2 ?
                                <ImportArea>
                                    <InputImport onChange={handleFileChange} type="file"
                                        accept=".csv, text/csv" 
                                     />
                                    <ButtonUpload onClick={handleUpload}>Upload</ButtonUpload>
                                </ImportArea>
                                : <p>Em Breve!</p>
                                }
                                </>
                                }
                                </div>                        
                              </>
                            }

                            { carregarExport || atualizar === 1 ? (
                              <>
                              <div>
                                <div style={{border:'1px solid', borderRadius:'0.3rem', fontSize:'0.8rem'}}>
                                  <div style={{padding: '0.5rem'}}>
                                    <p>Atualizando Base {nameBase}.</p>
                                    <p>Esse processo pode demora de acordo com da quantidade de registros.</p>
                                </div>
                                    <ProgressComponentBase exportar={true}/>
                                </div>
                            </div>
                              </>
                            ):(
                            <p style={mensagem !== "CSV importada com sucesso!" ?
                            {fontSize: "0.8rem", color: "red"} : {fontSize: "0.8rem", color: "green", fontWeight:"700"}}>{mensagem}</p>
                            )}
                            </>
                        } 
                />
            <InfoData>
                { info?.map((value, index) => (
                    <>
                     <div key={index} className="info" /*onClick={() => handleUpdate(value?.base, value?.id_info, value?.atualizar)}*/>
                        <div>
                            <FaDatabase style={{fontSize:"2.5em", marginRight: '0.3rem', color:"#13293d", fill:"#13293d"}} />
                        </div>
                        <div>
                            {loading ? (
                                <>
                                <p>Base: {value?.base}</p>
                                {value.atualizar === 0 ?
                                    <p>Data: {value?.dataImport == '2023-02-10T00:00:00' ? '--/--/----' : new Date(value?.dataImport).toLocaleDateString()}</p>
                                    :
                                    <>
                                    <p>Atualizando...</p>
                                    <ProgressComponentSleep status={true} width={"130px"} border={0}/>
                                    </>
                                }
                                </>
                            ) : (<p>Carregando...</p>)}
                        </div>
                     </div>
                     </>
                ))}
            </InfoData>
        </>
      )
  }
