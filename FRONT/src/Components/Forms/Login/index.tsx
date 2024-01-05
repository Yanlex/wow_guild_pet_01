/* eslint-disable react/jsx-props-no-spreading */

import AuthContext from 'Components/AuthState/AuthContext';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function LoginForm({ handleClose }) {
	const { login } = useContext(AuthContext);
	const { register, handleSubmit } = useForm();
	const [status, setStatus] = useState(null);
	// Сохранение состояния в LocalStorage

	const onSubmit = (data: any) => {
		fetch(`/api/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((response) => {
				if (response.ok) {
					login();
					setTimeout(() => {
						handleClose();
					}, 1000);
					// Обработка успешного ответа от сервера
					response.json().then((data) => {
						const success = data.message;
						setStatus(
							<div
								style={{
									color: 'white',
									margin: '5px 0 5px 0',
									backgroundColor: 'green',
									lineHeight: '20px',
									textAlign: 'center',
								}}
							>
								{success}
							</div>,
						);
					});
				} else {
					// Обработка ошибки от сервера
					response.json().then((data) => {
						// Получаем текст ошибки из поля "error" в ответе сервера
						const error = data.error || 'Ошибка при отправке данных';
						setStatus(
							<div
								style={{
									color: 'white',
									margin: '5px 0 5px 0',
									backgroundColor: 'red',
									lineHeight: '20px',
									textAlign: 'center',
								}}
							>
								{error}
							</div>,
						);
						// Обновляем состояние с текстом ошибки
					});
				}
			})
			.catch((error) => {
				// Обработка ошибки fetch
				setStatus(`Ошибка при отправке данных! ${error}`);
			});
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="regForm">
			<input
				type="text"
				autoComplete="off"
				{...register('name', { required: true, maxLength: 20 })}
				placeholder="Юзернейм"
			/>
			<input
				type="password"
				autoComplete="off"
				{...register('password', {
					required: 'required',
				})}
				placeholder="Пароль"
			/>
			<input type="submit" className="button" value="Войти" />
			{status}
		</form>
	);
}
