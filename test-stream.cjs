const fs = require('fs');

async function test() {
  const url = 'https://img.gamemonetize.com/y4c0575c3r2v9ym8s00j1u843x3c9l3p/512x384.jpg';
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://html5.gamemonetize.co/'
    }
  });

  console.log('Status:', response.status);
  console.log('Content-Type:', response.headers.get('content-type'));

  const stream = fs.createWriteStream('test.jpg');
  if (response.body) {
    const reader = response.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        stream.write(value);
      }
      stream.end();
      console.log('Done streaming');
    };
    pump();
  }
}

test();
