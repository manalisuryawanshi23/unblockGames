const express = require('express');

const app = express();

app.get('/proxy', async (req, res) => {
  const url = 'https://img.gamemonetize.com/we3v62yymmy7l2m9yuvuxdewrro4tloo/512x384.jpg';
  const response = await fetch(url, { 
    headers: { 'Referer': 'https://html5.gamemonetize.co/' } 
  });
  
  res.setHeader('Content-Type', 'image/jpeg');
  
  if (response.body) { 
    const reader = response.body.getReader(); 
    const pump = async () => { 
      while (true) { 
        const { done, value } = await reader.read(); 
        if (done) break; 
        res.write(value); 
      } 
      res.end(); 
    }; 
    pump(); 
  }
});

app.listen(3000, () => console.log('Ready'));
