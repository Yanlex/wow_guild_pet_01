
import React, { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from "react-hook-form";
import Cookies from 'js-cookie';
import { cookieState, userInfo } from '../../Store/Authenticated';


export default function LoginForm() {
  const { register, handleSubmit } = useForm();
  const [status, setStatus] = useState(null);
  const { setMyCookie } = cookieState()
  const onSubmit = data => {
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          // Обработка успешного ответа от сервера
          response.json().then(data => {
            // Получаем текст ошибки из поля "error" в ответе сервера
            // const token = data.token || 'Ошибка при отправке данных';
            // console.log(data.value)
            // Cookies.set('jwtToken', token, { expires: 1, path: '' }, { httpOnly: true });
            setMyCookie(true)
          });
        } else {
          // Обработка ошибки от сервера
          response.json().then(data => {
            // Получаем текст ошибки из поля "error" в ответе сервера
            const error = data.error || 'Ошибка при отправке данных';
            setStatus(
              <div style={{ color: 'white', margin: '5px 0 5px 0', backgroundColor: 'red', lineHeight: '20px', textAlign: 'center' }}>{error}</div>
            )
            // Обновляем состояние с текстом ошибки
          });
        }
      })
      .catch(error => {
        // Обработка ошибки fetch
        setStatus('Ошибка при отправке данных!', error)
      });
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className='regForm' >
      {
        status == 'Юзер успешно зарегистрирован' ? (<div style={{ color: 'black', padding: '10px', margin: '0 0 10px 0', backgroundColor: 'rgba(59, 219, 91, 0.6)', lineHeight: '20px', textAlign: 'center' }}><p>{status}</p></div>) : (<>
          <input type="text" autoComplete="off" {...register("name", { required: true, maxLength: 20 })} placeholder='Юзернейм' />
          <input type="password" autoComplete="off" {...register("password", {
            pattern: /^(?=.*[0-9])(?=.*[a-zA-Zа-яА-ЯёЁ])(?=.*[*.!@$%^&(){}[\]:;<>,.?/~_ +-=|\\]).{8,32}$/
          })} placeholder='Пароль' />
          <input type="submit" className='button' value='Войти' />
          {status}
        </>
        )
      }</form >)

}