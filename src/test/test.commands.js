'use strict';

const assert = require('assert');

const ffmpegjs = require('../ffmpeg');

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
});
