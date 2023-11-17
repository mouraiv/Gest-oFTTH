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

export default function AppRoutes(){
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/TesteOptico" element={<TesteOptico />} />
                    <Route path="/TesteOptico/Editar/:id" element={<Editar />} />
                    <Route path="/TesteOptico/Importar" element={<ImportFile />} />
                    <Route path="/TesteOptico/Visualizar/:id/:idNetwin" element={<Vizualizar />} />
                    <Route path="/TesteOptico/Imagem/:uf/:estacao/:cdo" element={<Imagem />} />
                    <Route path="/Analise/:id" element={<Analise />} />
                </Route>
                <Route path="/" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}