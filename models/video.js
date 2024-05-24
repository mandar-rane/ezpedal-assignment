const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, index: true },
    description: { type: String, index: true },
    publishedAt: { type: Date, index: true },
    thumbnails: Object,
    videoId: { type: String, unique: true }
})

module.exports = mongoose.model('Video', videoSchema);