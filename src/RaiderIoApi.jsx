import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FetchGuild() {
  const [guildData, setGuildData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:3000/guild-data');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      setGuildData(data);
    }
    fetchData();
  }, []);

  if (!guildData) {
    return <div>Loading...</div>;
  }
  console.log('RaiderIoApi.jsx')
  console.log(guildData.members)




  return (
    <div>
      <h1>{guildData.name}</h1>
      <p>Realm: {guildData.realm.slug}</p>
      <p>Members:</p>
      <ul>
        {guildData.members.map(member => (
          <li key={member.character.id}>{member.character.name} {member.rank}</li>
        ))}
      </ul>
    </div>
  );
}

export default FetchGuild;