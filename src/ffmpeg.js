'use strict';

const childProcess = require('child_process');
const util = require('util');

const executeSyncCommand = function(command, args) {

    const result =  childProcess.spawnSync(command, args);
    return { stdout: result.stdout.toString().trim(), stderr: result.stderr.toString().trim() }
};

const WHICH_CMD = 'which';
const FFMPEG_CMD = 'ffmpeg';
const FFPROBE_CMD = 'ffprobe';

const FFMPEG_DEFAULT_PATH = executeSyncCommand(WHICH_CMD, [ FFMPEG_CMD ]).stdout;
const FFPROBE_DEFAULT_PATH = executeSyncCommand(WHICH_CMD, [ FFPROBE_CMD ]).stdout;

const PROCESS_DATA_EVENT_NAME = 'data';
const PROCESS_CLOSE_EVENE_NAME = 'close';

const executeAsyncCommand = function (command, args, callback) {

    const result = { stdout: null, stderr: null, code: 1000 };
    const spawn = childProcess.spawn;
    const cmd = spawn(command, args);
    cmd.stdout.on(PROCESS_DATA_EVENT_NAME, (data) => {
        result.stdout = `${data}`.trim();
    });

    cmd.stderr.on(PROCESS_DATA_EVENT_NAME, (data) => {
        result.stderr = `${data}`.trim();
    });

    cmd.on(PROCESS_CLOSE_EVENE_NAME, (code) => {
        result.code = code;
        callback(result);
    });
};

let _currentFFMPEGpath = FFMPEG_DEFAULT_PATH;
const currentFFMPEGPath = function currentFFMPEGPath() {
    return _currentFFMPEGpath;
};
module.exports.currentFFMPEGPath = currentFFMPEGPath;

/**
 *  @name setFFMPEGPath
 *  @description Sets custom path for 'ffmpeg.'
 *  @param path [String] can not be null.
 *  @return [String] FFMPEG path, defaults to FFMPEG_DEFAULT_PATH is 'path' is not a string.
 */
 module.exports.setFFMPEGPath = function setFFMPEGPath (path) {

     if ( path !== null ) {
         _currentFFMPEGpath = `${path}`;
     } else {
         _currentFFMPEGpath = FFMPEG_DEFAULT_PATH;
     }

     return _currentFFMPEGpath;
 };

 const VERSION_SWITCH = '-version'

const ffmpegVersion = function ffmpegVersion() {

    const result = executeSyncCommand(currentFFMPEGPath(), [ VERSION_SWITCH ]).stdout;
    return result.split('\n')[0];
};
module.exports.ffmpegVersion = ffmpegVersion;

module.exports.ffmpegVersionShort = function ffmpegVersionShort() {
    return ffmpegVersion().split(' ')[2].split('-')[0];
};

let _currentFFPROBEPath = FFPROBE_DEFAULT_PATH;
const currentFFPROBEPath = function currentFFPROBEPath() {
    return _currentFFPROBEPath;
};
module.exports.currentFFPROBEPath = currentFFPROBEPath;

module.exports.setFFPROBEPath = function setFFPROBEPath(path) {

    if ( path !== null ) {
        _currentFFPROBEPath = `${path}`;
    } else {
        _currentFFPROBEPath = FFPROBE_DEFAULT_PATH;
    }

    return _currentFFPROBEPath;
};

const ffprobeVersion = function ffprobeVersion() {

    const result = executeSyncCommand(currentFFPROBEPath(), [ VERSION_SWITCH ]).stdout;
    return result.split('\n')[0];
};
module.exports.ffprobeVersion = ffprobeVersion;

module.exports.ffprobeVersionShort = function ffprobeVersionShort() {
    return ffprobeVersion().split(' ')[2].split('-')[0];
};

const INT_KEYS = [ 'nb_frames', 'size', 'bit_rate', 'width', 'height' ];
const FLOAT_KEYS = [ 'duration' ];
const VIDEO_CODEC_TYPE = 'video';
const AUDIO_CODEC_TYPE = 'audio';

const parseFFPROBEData = function parseFFPROBEData(data) {

    if ( (typeof data !== 'string') || (data.length < 1) ) return {};

    const workingData = data.trim();
    if ( (! workingData.startsWith('{')) && (! workingData.endsWith('}')) ) return {};

    const working = JSON.parse(data, (key, value) => {

        if ( FLOAT_KEYS.indexOf(key) !== -1 ) {
            return parseFloat(value);
        } else if ( INT_KEYS.indexOf(key) !== -1 ) {
            return parseInt(value);
        }

        return value;
    });

    let hasVideo = false;
    let hasAudio = false;
    let videoCodec = null;
    let audioCodec = null;
    let width = 0;
    let height = 0;
    let frames = 0;
    const streams = working.streams;
    if ( Array.isArray(streams) ) {

        streams.forEach((element) => {

            const codecType = element.codec_type;
            if ( codecType === VIDEO_CODEC_TYPE ) {
                videoCodec = element.codec_name;
                hasVideo = true;
                width = element.width;
                height = element.height;
                frames = element.nb_frames;
            } else if ( codecType === AUDIO_CODEC_TYPE ) {
                audioCodec = element.codec_name;
                hasAudio = true;
            }
        });
    }

    const format = working.format;
    let duration = null
    let bitrate = null;
    let fileSize = null;
    if ( format ) {
        duration = format.duration;
        bitrate = format.bit_rate;
        fileSize = format.size;
    }

    return {
        duration: duration ? duration : 0.0,
        bit_rate: bitrate ? bitrate : 0,
        file_size: fileSize ? fileSize : 0,
        video_codec: videoCodec,
        has_video: hasVideo,
        has_audio: hasAudio,
        audio_codec: audioCodec,
        width: width,
        height: height,
        frames: frames,
    };
};

const FFPROBE_ARGS = [ '-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams' ];

module.exports.readMetaData = function readMetaData(mediaPath, ffprobePath) {

    if ( (typeof mediaPath !== 'string') || (mediaPath.length < 2) ) {
        return {};
    }

    const commandArray = FFPROBE_ARGS.slice();
    commandArray.push(mediaPath);

    const cmdPath = ( ffprobePath ? ffprobePath : currentFFPROBEPath() );
    const cmdResult = executeSyncCommand(FFPROBE_DEFAULT_PATH, commandArray);
    // console.log(`CMD RESULT: ${cmdResult.stdout}`);
    // console.log(`CMD ERROR: ${cmdResult.stderr}`);
    const metaData = parseFFPROBEData(cmdResult.stdout);
    return metaData;
};

if ( process.env.NODE_ENV === 'test' ) {
    module.exports.executeAsyncCommand = executeAsyncCommand;
    module.exports.parseFFPROBEData = parseFFPROBEData;
}
