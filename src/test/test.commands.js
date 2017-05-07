'use strict';

if ( process.env.NODE_ENV !== 'test' ) process.env.NODE_ENV = 'test';

const assert = require('assert');

const ffmpegjs = require('../ffmpeg');

const TEST_CONSTANTS = require('./test-constants').CONSTANTS;

describe('Basic Native Commands', () => {

    describe('Versions', () => {

        const shortVersion = function(version) {
            return version.split(' ')[2].split('-')[0];
        };

        // NOTE: Update these if the version is updated in the docker container.
        const FFMPEG_VERSION = 'ffmpeg version 2.8.10-0ubuntu0.16.04.1 Copyright (c) 2000-2016 the FFmpeg developers';
        const FFPROBE_VERSION = 'ffprobe version 2.8.10-0ubuntu0.16.04.1 Copyright (c) 2007-2016 the FFmpeg developers';

        const expectedFFMPEGShortVersion = function() {
            return shortVersion(FFMPEG_VERSION)
        };

        const expectedFFPROBEShortVersion = function() {
            return shortVersion(FFPROBE_VERSION);
        };

        it('should return FFMPEG Version', (done) => {

            const actualVersion = ffmpegjs.ffmpegVersion();
            assert.equal(FFMPEG_VERSION, actualVersion);
            done();
        });

        it('should return short FFMPEG version.', (done) => {

            const shortVersion = ffmpegjs.ffmpegVersionShort();
            assert.equal(expectedFFMPEGShortVersion(), shortVersion);
            done();
        });

        it('should return FFPROBE Version', (done) => {

            const actualVersion = ffmpegjs.ffprobeVersion();
            assert.equal(FFPROBE_VERSION, actualVersion);
            done();
        });

        it('should return FFPROBE Short Version.', (done) => {

            const actualVersion = ffmpegjs.ffprobeVersionShort();
            assert.equal(expectedFFPROBEShortVersion(), actualVersion);
            done();
        });
    });

    describe('Async Native Calls', () => {

        // based on the install location in the docker container
        const EXPECTED_FFMPEG_DEFAULT_PATH = '/usr/bin/ffmpeg';
        const EXPECTED_FFPROBE_DEFAULT_PATH = '/usr/bin/ffprobe';

        it('should return FFMPEG path without error', (done) => {

            ffmpegjs.executeAsyncCommand('which', [ 'ffmpeg' ], (result) => {
                assert.strictEqual(EXPECTED_FFMPEG_DEFAULT_PATH, result.stdout)
                assert(result.stderr === undefined || result.stderr === null || assert.stderr === '')
                assert.strictEqual(0, result.code);
                done();
            });
        });
    });

    describe('FFPROBE Commands', () => {

        const SAMPLE_VIDEO_FILE = `${__dirname}/${TEST_CONSTANTS.VIDEO_640_480_PATH}`;


        it('should return valid meta data for sample video', (done) => {

            const metaData = ffmpegjs.readMetaData(SAMPLE_VIDEO_FILE);
            assert.strictEqual(true, metaData.has_video);
            assert.strictEqual(TEST_CONSTANTS.VIDEO_H264_CODEC, metaData.video_codec);
            assert.strictEqual(TEST_CONSTANTS.VIDEO_64_WIDTH, metaData.width);
            assert.strictEqual(TEST_CONSTANTS.VIDEO_64_HEIGHT, metaData.height);
            assert(Math.abs(TEST_CONSTANTS.VIDEO_64_DURATION - metaData.duration) <= TEST_CONSTANTS.ELLIPSIS);
            assert(metaData.bit_rate > 0);
            assert(metaData.file_size > 0);
            assert(true, metaData.has_audio);
            assert.strictEqual(TEST_CONSTANTS.AUDIO_CODEC_AAC, metaData.audio_codec);

            done();
        });
    });
});
