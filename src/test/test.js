'use strict';

if ( process.env.NODE_ENV !== 'test' ) process.env.NODE_ENV = 'test';

const assert = require('assert');

const ffmpegjs = require('../ffmpeg');

describe('Executable paths', ()=> {

    // based on the install location in the docker container
    const EXPECTED_FFMPEG_DEFAULT_PATH = '/usr/bin/ffmpeg';
    const EXPECTED_FFPROBE_DEFAULT_PATH = '/usr/bin/ffprobe';

    describe('Defaults', ()=> {

        afterEach((done) => {

            // resets the paths to default
            ffmpegjs.setFFMPEGPath(null);
            ffmpegjs.setFFPROBEPath(null);
            done();
        });

        it(`should be set to '${EXPECTED_FFMPEG_DEFAULT_PATH}' for FFMPEG .`, (done) => {

            const actualPath = ffmpegjs.currentFFMPEGPath();
            assert.equal(EXPECTED_FFMPEG_DEFAULT_PATH, actualPath);
            done();
        });

        it(`should be set to '${EXPECTED_FFPROBE_DEFAULT_PATH}' for FFPROBE`, (done) => {

            const actualPath = ffmpegjs.currentFFPROBEPath();
            assert.equal(EXPECTED_FFPROBE_DEFAULT_PATH, actualPath);
            done();
        });
    });

    describe('Custom Paths', () => {

        afterEach((done) => {

            // resets the paths to default
            ffmpegjs.setFFMPEGPath(null);
            ffmpegjs.setFFPROBEPath(null);
            done();
        });

        const CUSTOM_FFMPEG_PATH = '/usr/local/bin/ffmpeg';

        it(`should be set to '${CUSTOM_FFMPEG_PATH}'`, (done) => {

            const defaultPath = ffmpegjs.currentFFMPEGPath();
            const actualPath = ffmpegjs.setFFMPEGPath(CUSTOM_FFMPEG_PATH);
            assert.equal(CUSTOM_FFMPEG_PATH, actualPath);
            assert.notEqual(defaultPath, actualPath);
            done();
        });

        const CUSTOM_FFPROBE_PATH = '/usr/local/bin/ffprobe';

        it(`should be set to '${CUSTOM_FFPROBE_PATH}'`, (done) => {

            const defaultPath = ffmpegjs.currentFFPROBEPath();
            const actualPath = ffmpegjs.setFFPROBEPath(CUSTOM_FFPROBE_PATH);
            assert.equal(CUSTOM_FFPROBE_PATH, actualPath);
            assert.notEqual(defaultPath, actualPath);
            done();
        });

        it('should reset FFMPEG path back to default', (done) => {

            const defaultPath = ffmpegjs.currentFFMPEGPath();
            assert.equal(EXPECTED_FFMPEG_DEFAULT_PATH, defaultPath);

            const customPath = ffmpegjs.setFFMPEGPath(CUSTOM_FFMPEG_PATH);
            assert.equal(CUSTOM_FFMPEG_PATH, customPath);
            assert.notEqual(defaultPath, customPath);

            const resetPath = ffmpegjs.setFFMPEGPath(null);
            assert.equal(defaultPath, resetPath);
            done();
        });

        it('should reset FFPROBE path back to default', (done) => {

            const defaultPath = ffmpegjs.currentFFPROBEPath();
            assert.equal(EXPECTED_FFPROBE_DEFAULT_PATH, defaultPath);

            const customPath = ffmpegjs.setFFPROBEPath(CUSTOM_FFPROBE_PATH);
            assert.equal(CUSTOM_FFPROBE_PATH, customPath);
            assert.notEqual(defaultPath, customPath);

            const resetPath = ffmpegjs.setFFPROBEPath(null);
            assert.equal(resetPath, defaultPath);
            done();
        });
    });
});
