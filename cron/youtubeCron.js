const cron = require('node-cron');
const fetchYoutubeVideos = require('../services/youtubeService')

const query = process.env.YOUTUBE_SEARCH_QUERY;

cron.schedule('*/10 * * * * *', () => {
    fetchYoutubeVideos(query);
})