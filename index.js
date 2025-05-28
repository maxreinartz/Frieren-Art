const express = require("express");
const fs = require("fs");
const path = require("path");
const { method } = require("requests");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 7689;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/img/random', sendRandomImage('img'));
app.get('/api/img/sfw', sendSFWImage('img'));
app.get('/api/img/nsfw', sendNSFWImage('img'));
app.get('/api/lastUpdate', (req, res) => {
  const lastUpdate = new Date(fs.statSync(path.join(__dirname, 'img')).mtime);
  res.json({ lastUpdate: lastUpdate.toISOString() });
});
app.get('/api/endpoints', (req, res) => {
  res.json({
    endpoints: [
      { method: 'GET', path: '/api/img/random', description: 'Get a random image' },
      { method: 'GET', path: '/api/img/sfw', description: 'Get a random SFW image' },
      { method: 'GET', path: '/api/img/nsfw', description: 'Get a random NSFW image' },
      { method: 'GET', path: '/api/lastUpdate', description: 'Get the last update' },
      { method: 'GET', path: '/api/endpoints', description: 'List all available API endpoints' }
    ]
  });
});

function sendSFWImage(dir) {
  return (req, res) => {
    const dirPath = path.join(__dirname, dir);

    fs.readdir(dirPath, (err, files) => {
      if (err) {
        res.status(500).send("Server error");
        return;
      }

      const sfwFiles = files.filter(file => !file.includes('NSFW'));
      if (sfwFiles.length === 0) {
        res.status(404).send("No SFW images found");
        return;
      }

      const file = sfwFiles[Math.floor(Math.random() * sfwFiles.length)];

      res.sendFile(path.join(dirPath, file));
    });
  };
}

function sendNSFWImage(dir) {
  return (req, res) => {
    const dirPath = path.join(__dirname, dir);

    fs.readdir(dirPath, (err, files) => {
      if (err) {
        res.status(500).send("Server error");
        return;
      }

      const nsfwFiles = files.filter(file => file.includes('NSFW'));
      if (nsfwFiles.length === 0) {
        res.status(404).send("No NSFW images found");
        return;
      }

      const file = nsfwFiles[Math.floor(Math.random() * nsfwFiles.length)];

      res.sendFile(path.join(dirPath, file));
    });
  };
}

function sendRandomImage(dir) {
  return (req, res) => {
    const dirPath = path.join(__dirname, dir);

    fs.readdir(dirPath, (err, files) => {
      if (err) {
        res.status(500).send("Server error");
        return;
      }

      const file = files[Math.floor(Math.random() * files.length)];

      res.sendFile(path.join(dirPath, file));
    });
  };
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => console.log(`Server running on http://127.0.0.1:${port}`));