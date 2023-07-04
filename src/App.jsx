import React from 'react';
import FetchGuild from './RaiderIoApi';



export default function Profile() {
  return (
    <div className='container'>
      <FetchGuild />
    </div>
  )
}
