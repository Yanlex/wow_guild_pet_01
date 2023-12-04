/* eslint-disable import/no-unresolved */
import React from 'react';
import { Link } from 'react-router-dom';
import DialogButton from '../Buttons/DialogButton';
import LoginForm from '../Forms/Login/Login';
import RegistrationForm from '../Forms/Registration/Registration';

export default function HeaderNavigation() {
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
			</nav>
		</div>
	);
}
