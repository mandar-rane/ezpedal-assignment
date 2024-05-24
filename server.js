const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/video');
const youtubeCron = require('./cron/youtubeCron');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get('/videos', async(req, res) => {
    const { page = 1, limit = 10 , sort = 'desc'} = req.query;
    const sortOrder = sort === 'asc' ? 1 : -1;
    const count = await Video.countDocuments();
    const totalPages = Math.ceil(count / limit);
    const videos = await Video.find()
    .sort({ publishedAt: sortOrder })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({ videos, totalPages });
});

app.get('/search', async (req, res) => {
    const { q, page = 1, limit = 10 ,sort = 'desc'} = req.query;
    const regex = new RegExp(q, 'i');
    const sortOrder = sort === 'asc' ? 1 : -1;

    const videos = await Video.find({
      $or: [{ title: regex }, { description: regex }]
    })
      .sort({ publishedAt: sortOrder  })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
  
    res.json(videos);
});
  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});