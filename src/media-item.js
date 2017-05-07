'use strict';

const fs = require('fs');
const ffmpeg = require('./ffmpeg');

module.exports.MediaItem = class MediaItem {

    constructor(sourceFile) {
        this.sourceFile = sourceFile;
        this.metaData = ffmpeg.readMetaData(sourceFile)
    }

    hasVideo() { return this.metaData && this.metaData.has_video ? this.metaData.has_video : false; }
    hasAudio() { return this.metaData && this.metaData.has_audio ? this.metaData.has_audio : false; }
    duration() { return this.metaData? this.metaData.duration : 0; }
    frames() { return this.metaData ? this.metaData.frames : 0; }
    fps() { return this.frames() / this.duration(); }
    bitRate() { return this.metaData ? this.metaData.bit_rate : 0; }
    audioCodec() { return this.hasAudio() ? this.metaData.audio_codec : null; }
    videoCodec() { return this.hasVideo() ? this.metaData.video_codec : null; }
    exists() { return fs.existsSync(this.sourceFile); }
};
