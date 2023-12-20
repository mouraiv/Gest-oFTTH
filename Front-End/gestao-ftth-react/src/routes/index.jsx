import React from "react";
import ProtectedRoute from './ProtectedRoute';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TesteOptico from '../pages/TesteOptico';
import Vizualizar from "../pages/TesteOptico/Vizualizar";
import Login from '../pages/Login';
import ImportFile from "../pages/TesteOptico/Importar";
import Imagem from "../pages/TesteOptico/Imagens";
import Editar from "../pages/TesteOptico/Editar";
import Analise from "../pages/Analise";
import Home from "../pages/Home";
import EnderecoTotal from "../pages/EnderecoTotal";
import BaseAcumulada from "../pages/BaseAcumulada";
import GanhoSurvey from "../pages/GanhoSurvey";

export default function AppRoutes(){
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/Home" element={<Home />} />
                    <Route path="/TesteOptico" element={<TesteOptico />} />
                    <Route path="/TesteOptico/Editar/:id" element={<Editar />} />
                    <Route path="/TesteOptico/Importar" element={<ImportFile />} />
                    <Route path="/TesteOptico/Visualizar/:id/:idNetwin/:survey" element={<Vizualizar />} />
                    <Route path="/TesteOptico/Imagem/:uf/:sigla/:cdo" element={<Imagem />} />
                    <Route path="/Analise/:id/:idNetwin" element={<Analise />} />
                    <Route path="/EnderecoTotal" element={<EnderecoTotal />} />
                    <Route path="/BaseAcumulada" element={<BaseAcumulada />} />
                    <Route path="/GanhoSurvey" element={<GanhoSurvey />} />
                </Route>
                <Route path="/" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}