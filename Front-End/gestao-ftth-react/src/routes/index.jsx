import React from "react";
import ProtectedRoute from './ProtectedRoute';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TesteOptico from '../pages/TesteOptico';
import Vizualizar from "../pages/TesteOptico/Vizualizar";
import Login from '../pages/Login';
import ImportFile from "../pages/TesteOptico/Importar";
import Imagem from "../pages/TesteOptico/Imagens";

export default function AppRoutes(){
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/TesteOptico" element={<TesteOptico />} />
                    <Route path="/TesteOptico/Importar" element={<ImportFile />} />
                    <Route path="/TesteOptico/Visualizar/:id" element={<Vizualizar />} />
                    <Route path="/TesteOptico/Imagem/:uf/:estacao/:cdo" element={<Imagem />} />
                </Route>
                <Route path="/" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}