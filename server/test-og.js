const http = require('http');
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/og/game/train-subway-surfers',
  headers: { 'user-agent': 'WhatsApp/2.23' }
};
http.get(options, r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    console.log('Status:', r.statusCode);
    const titleMatch = d.match(/og:title[^>]*content="([^"]+)"/);
    const imgMatch = d.match(/og:image[^>]*content="([^"]+)"/);
    const descMatch = d.match(/og:description[^>]*content="([^"]+)"/);
    console.log('og:title:', titleMatch ? titleMatch[1] : 'NOT FOUND');
    console.log('og:image:', imgMatch ? imgMatch[1] : 'NOT FOUND');
    console.log('og:description:', descMatch ? descMatch[1].slice(0,100) : 'NOT FOUND');
  });
}).on('error', e => {
  console.error('Error:', e.message);
});
