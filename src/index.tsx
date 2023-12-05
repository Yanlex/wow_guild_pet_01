import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css';
import AuthProvider from './AuthProvider';

const root = createRoot(document.getElementById('root'));
root.render(
	<AuthProvider>
		<App />
	</AuthProvider>,
);
