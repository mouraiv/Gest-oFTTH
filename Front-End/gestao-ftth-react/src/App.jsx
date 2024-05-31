import React from "react"

import AppRoutes from './routes'
import { CancelTokenProvider } from './contexts/CancelTokenContext';
import { AuthProvider }  from "./contexts/auth"

export default function App() {
	return (
		<AuthProvider>
			<CancelTokenProvider>
				<AppRoutes />
			</CancelTokenProvider>
		</AuthProvider>
	)
}