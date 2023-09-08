import React from "react"

import { BrowserRouter, Routes, Route } from "react-router-dom"

import TesteOptico from "./pages/TesteOptico";
import Login from "./pages/Login";

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/TesteOptico" element={<TesteOptico />} />
			</Routes>
		</BrowserRouter>
	)
}