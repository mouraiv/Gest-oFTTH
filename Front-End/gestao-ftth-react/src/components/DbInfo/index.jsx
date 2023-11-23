import React, {useState, useEffect} from "react";
import { InfoData } from "./styles";
import { getInfo } from "../../api/info";

export default function InfoDataBase() {
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState();

    async function fecthInfo(){
        try {
            const detalheInfo = await getInfo();

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

    console.log(info);

      return (
        <>
            <InfoData>
                { info?.map((value, index) => (
                     <div key={index} className="info">
                        <p>Base: {value?.base}</p>
                        <p>Data: {new Date(value?.dataImport).toLocaleDateString()}</p>
                     </div>
                ))}
            </InfoData>
        </>
      )
  }
