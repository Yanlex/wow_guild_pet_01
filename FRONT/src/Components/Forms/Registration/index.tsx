import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

export default function RegistrationForm() {
	const { register, handleSubmit, control } = useForm({
		defaultValues: {
			password: '',
			email: '',
			name: '',
		},
	});
	const [status, setStatus] = useState(null);
	const onSubmit = (data: string[]) => {
		fetch(`${process.env.REACT_APP_BASE_API_URL}/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((response) => {
				if (response.ok) {
					// Обработка успешного ответа от сервера
					response.json().then((data) => {
						// Получаем текст ошибки из поля "error" в ответе сервера
						const ok = data.message || 'Ошибка при отправке данных';
						setStatus(ok);
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
				setStatus(`'Ошибка при отправке данных!', ${error}`);
			});
	};

	const green = {
		color: 'green',
		fontWeight: 'bold',
	};

	const normalStyle = {
		color: 'red',
		fontWeight: 'normal',
	};

	const passwordUseWatch = useWatch({
		control,
		name: 'password',
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="regForm">
			{status === 'Юзер успешно зарегистрирован' ? (
				<div
					style={{
						color: 'black',
						padding: '10px',
						margin: '0 0 10px 0',
						backgroundColor: 'rgba(59, 219, 91, 0.6)',
						lineHeight: '20px',
						textAlign: 'center',
					}}
				>
					<p>{status}</p>
				</div>
			) : (
				<>
					<input
						type="text"
						autoComplete="off"
						{...register('name', { required: true, maxLength: 20 })}
						placeholder="Юзернейм"
					/>
					<input
						type="email"
						autoComplete="off"
						{...register('email', {
							pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
						})}
						placeholder="Емейл"
					/>
					<input
						type="password"
						autoComplete="off"
						{...register('password', {
							pattern:
								/^(?=.*[0-9])(?=.*[a-zA-Zа-яА-ЯёЁ])(?=.*[*.!@$%^&(){}[\]:;<>,.?/~_ +-=|\\]).{8,32}$/,
						})}
						placeholder="Пароль"
					/>
					<label htmlFor="password" style={{ marginLeft: '20px' }}>
						<ul>
							<li style={/^.{8,}$/.test(passwordUseWatch) ? green : normalStyle}>
								Длина пароля не менее 8 символов
							</li>
							<li style={/\d/.test(passwordUseWatch) ? green : normalStyle}>
								Пароль должен содержать 1 цифру
							</li>
							<li style={/[\W_]/.test(passwordUseWatch) ? green : normalStyle}>
								Пароль должен содержать 1 знак
							</li>
							<li style={/[\p{Lu}]/u.test(passwordUseWatch) ? green : normalStyle}>
								Пароль должен содержать 1 заглавную букву
							</li>
							<li style={/[\p{Ll}]/u.test(passwordUseWatch) ? green : normalStyle}>
								Пароль должен содержать 1 букву в нижнем регистре
							</li>
						</ul>
					</label>
					<input type="submit" className="button" />
					<p>{status}</p>
				</>
			)}
		</form>
	);
}
