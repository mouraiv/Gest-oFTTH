import React from "react";
import ProtectedRoute from './ProtectedRoute';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TesteOptico from '../pages/TesteOptico';
import Vizualizar from "../pages/TesteOptico/Vizualizar";
import Login from '../pages/Login';
import ImportFile from "../pages/TesteOptico/Importar";

export default function AppRoutes(){
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/TesteOptico" element={<TesteOptico />} />
                    <Route path="/TesteOptico/Visualizar/:id" element={<Vizualizar />} />
                </Route>
                <Route path="/TesteOptico/Importar" element={<ImportFile />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}