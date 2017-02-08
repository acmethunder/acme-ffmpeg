'use strict';

const childProcess = require('child_process');

const FFMPEG_DEFAULT_PATH = '/usr/bin/ffmpeg';
const FFPROBE_DEFAULT_PATH = '/usr/bin/ffprobe';

const executeSyncCommand = function(command, args) {
    return childProcess.spawnSync(command, args).stdout.toString();
};

let _currentFFMPEGpath = FFMPEG_DEFAULT_PATH;
const currentFFMPEGPath = function() {
    return _currentFFMPEGpath;
};
module.exports.currentFFMPEGPath = currentFFMPEGPath;

/**
 *  @name setFFMPEGPath
 *  @description Sets custom path for 'ffmpeg.'
 *  @param path [String] can not be null.
 *  @return [String] FFMPEG path, defaults to FFMPEG_DEFAULT_PATH is 'path' is not a string.
 */
 const setFFMPEGPath = function(path) {

     if ( path !== null ) {
         _currentFFMPEGpath = `${path}`;
     } else {
         _currentFFMPEGpath = FFMPEG_DEFAULT_PATH;
     }

     return _currentFFMPEGpath;
 };
module.exports.setFFMPEGPath = setFFMPEGPath;

const ffmpegVersion = function() {

    const result = executeSyncCommand(currentFFMPEGPath(), [ '-version' ]);
    return result.split('\n')[0];
};
module.exports.ffmpegVersion = ffmpegVersion;

const ffmpegVersionShort = function() {
    return ffmpegVersion().split(' ')[2].split('-')[0];
};
module.exports.ffmpegVersionShort = ffmpegVersionShort;

let _currentFFPROBEPath = FFPROBE_DEFAULT_PATH;
const currentFFPROBEPath = function() {
    return _currentFFPROBEPath;
};
module.exports.currentFFPROBEPath = currentFFPROBEPath;

const setFFPROBEPath = function(path) {

    if ( path !== null ) {
        _currentFFPROBEPath = `${path}`;
    } else {
        _currentFFPROBEPath = FFPROBE_DEFAULT_PATH;
    }

    return _currentFFPROBEPath;
};
module.exports.setFFPROBEPath = setFFPROBEPath;

const ffprobeVersion = function() {

    const result = executeSyncCommand(currentFFPROBEPath(), [ '-version' ]);
    return result.split('\n')[0];
};
module.exports.ffprobeVersion = ffprobeVersion;

const ffprobeVersionShort = function() {
    return ffprobeVersion().split(' ')[2].split('-')[0];
};
module.exports.ffprobeVersionShort = ffprobeVersionShort;
