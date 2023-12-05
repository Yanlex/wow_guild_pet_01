/* eslint-disable import/no-unresolved */
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import DialogButton from '../Buttons/DialogButton';
import LoginForm from '../Forms/Login/Login';
import RegistrationForm from '../Forms/Registration/Registration';
import AuthContext from '../../AuthContext';
import Cookies from 'js-cookie';

export default function HeaderNavigation() {
	const userName = Cookies.get('User');
	const { isAuthenticated, login, logout } = useContext(AuthContext);
	return (
		<div className="header__auth_menu">
			<nav className="header__nav_main">
				<ul className="header__nav_ul">
					<li>
						<Link to="/">Главная</Link>
					</li>
					<li>
						<Link to="/guides">Гайды</Link>
					</li>
				</ul>
			</nav>
			<nav className="header__navigation_login">
				{isAuthenticated ? (
					<>
						<div>{userName}</div>
						<button type="button" onClick={() => logout()} className="button">
							ВЫЙТИ
						</button>
					</>
				) : (
					<>
						<div>
							<DialogButton
								childComponent={<RegistrationForm />}
								buttonText="Регистрация"
								formTitle="Форма регистрации"
								addStyle="button__reg button"
							/>
						</div>
						<div>
							<DialogButton
								childComponent={<LoginForm />}
								buttonText="Войти"
								formTitle="Форма авторизации"
								addStyle="button__log button"
							/>
						</div>
					</>
				)}
			</nav>
		</div>
	);
}
