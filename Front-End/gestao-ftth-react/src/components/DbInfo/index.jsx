import React, {useState, useEffect} from "react";
import { InfoData } from "./styles";
import { GetInfo } from "../../api/info";
import { FaDatabase } from 'react-icons/fa6';

export default function InfoDataBase() {
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState();

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

    useEffect(() => {
        fecthInfo();
    },[])

      return (
        <>
            <InfoData>
                { info?.map((value, index) => (
                     <div key={index} className="info">
                        <div>
                            <FaDatabase style={{fontSize:"2.5em", marginRight: '0.3rem', color:"#13293d", fill:"#13293d"}} />
                        </div>
                        <div>
                            {loading ? (
                                <>
                                <p>Base: {value?.base}</p>
                                <p>Data: {value?.dataImport == '2023-02-10T00:00:00' ? '--/--/----' : new Date(value?.dataImport).toLocaleDateString()}</p>
                                </>
                            ) : (<p>Carregando...</p>)}
                        </div>
                     </div>
                ))}
            </InfoData>
        </>
      )
  }
