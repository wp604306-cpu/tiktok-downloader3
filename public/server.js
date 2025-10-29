import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint download TikTok
app.post('/download', async (req, res) => {
  const { url } = req.body;
  if(!url) return res.status(400).json({ error: 'URL kosong' });

  try {
    const apiURL = `https://api.tikmate.app/api/lookup?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiURL);
    const data = await response.json();

    if(data.video && data.video.downloadAddr){
      res.json({ video: data.video.downloadAddr });
    } else {
      res.status(500).json({ error: 'Gagal mendapatkan video' });
    }
  } catch(err) {
    res.status(500).json({ error: 'Terjadi error server' });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
