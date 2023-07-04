const https = require('https');



const name = 'Чоски';
const url = `https://raider.io/api/v1/characters/profile?region=eu&realm=howling-fjord&name=${name}&fields=guild`;

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const result = JSON.parse(data);
    console.log(result)
    const score = result.guild.name
    console.log(score)
  });
}).on('error', (err) => {
  console.error(err.message);
});
