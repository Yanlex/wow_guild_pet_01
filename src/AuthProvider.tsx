import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
	function handleLogout() {
		fetch('/clear-cookie', {
			method: 'GET',
			credentials: 'include', // <--- YOU NEED THIS LINE
		})
			.then((response) => {
				if (response.redirected) {
					return window.location.replace(response.url);
				}
			})
			.catch((error) => {
				console.error('Error clearing cookies', error);
			});
	}

	const [isAuthenticated, setIsAuthenticated] = useState(
		JSON.parse(localStorage.getItem('isAuthenticated')) || false,
	);

	useEffect(() => {
		localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
	}, [isAuthenticated]);

	const login: () => void = () => {
		setIsAuthenticated(true);
	};

	const logout: () => void = () => {
		setIsAuthenticated(false);
		localStorage.clear();
		handleLogout();
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
