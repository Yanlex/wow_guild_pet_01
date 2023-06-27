import React from 'react';
import Profile2 from './Second';
import FetchGuild from './RaiderIoApi';



export default function Profile() {
  return (
    <>
      <img
        src="https://i.imgur.com/MK3eW3Am.jpg"
        alt="Katherine Johnson"
      />
      <Profile2 />
      <FetchGuild />

    </>
  )
}
