import React from "react";
import ProtectedRoute from './ProtectedRoute';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TesteOptico from '../pages/TesteOptico';
import Login from '../pages/Login';

export default function AppRoutes(){
    return (
        <BrowserRouter>
            <Routes>
                
                <Route element={<ProtectedRoute />}>
                    <Route path="/TesteOptico" element={<TesteOptico />} />
                </Route>
                <Route path="/" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}