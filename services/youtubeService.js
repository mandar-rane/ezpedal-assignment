const axios = require('axios');
const Video = require('../models/video');
const dotenv = require('dotenv');
dotenv.config();
const apiKeys = process.env.YOUTUBE_API_KEYS.split(',');


let currentApiKeyIndex = 0

async function fetchYoutubeVideos(query) {

    const apiKey = apiKeys[currentApiKeyIndex];
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&q=${query}&type=video&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const videos = response.data.items.map(item => ({
            title: item.snippet.title,
            description: item.snippet.description,
            publishedAt: new Date(item.snippet.publishedAt),
            thumbnails: item.snippet.thumbnails,
            videoId: item.id.videoId
        }));

        for (const video of videos) {
            try {
                await Video.create(video);
            } catch (err) {
                if (err.code === 11000) {
                    // Duplicate key error, ignore
                    console.log(`Duplicate videoId: ${video.videoId}, skipping...`);
                } else {
                    console.error('Error inserting video:', err.message);
                }
            }
        }
    } catch (error) {
        if (error.response && error.response.status === 403) {
            currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
            console.error('Using API key no:', currentApiKeyIndex);
        }
        console.error('Error fetching videos:', error.message);
    }
}

module.exports = fetchYoutubeVideos;