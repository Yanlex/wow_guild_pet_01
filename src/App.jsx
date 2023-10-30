import React, { useEffect, useState } from 'react';
import FetchGuild from './RaiderIoApi';
import DialogButton from './Components/Buttons/DialogButton';
import RegistrationForm from './Components/Forms/Registration/Registration';
import LoginForm from './Components/Forms/Login/Login';
import Cookies from 'js-cookie';
import { Username, cookieState } from './Components/Store/Authenticated';


export default function App() {

  const { myCookie, setMyCookie } = cookieState()
  const { myName, setMyName } = Username()

  console.log(Cookies.get())

  useEffect(() => {
    const authCheck = async () => {
      const myCookies = Cookies.get();
      const token = myCookies.jwtToken;
      if (token) {
        const response = await fetch('http://localhost:3000/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token }) // Оберните токен в объект
        });

        const data = await response.json(); // Обработка результата запроса
        if (data) {
          Cookies.set('UserName', data.username, { expires: 1, path: '' })
          setMyName(Cookies.get('UserName'))
          setMyCookie(true)
        } else {
          setMyCookie(false)
        }
      };
    }

    authCheck()
  }, [myCookie])

  if (myCookie) {
    return (
      <div className='container'>
        <div className='content'>
          <div className='header'>
            <div>Привет {myName}!</div>
          </div>
          <FetchGuild />
        </div>
      </div>
    )
  } else {
    return (
      <div className='container'>
        <div className='content'>
          <div className='header'>
            <div><DialogButton childComponent={<RegistrationForm />} buttonText={"Регистрация"} formTitle={"Форма регистрации"} /></div>
            <div><DialogButton childComponent={<LoginForm />} buttonText={"Войти"} formTitle={"Форма авторизации"} /></div>
          </div>
          <FetchGuild />
        </div>
      </div>
    )
  }

}


