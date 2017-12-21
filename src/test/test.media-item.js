'use strict';

if ( process.env.NODE_ENV !== 'test' ) process.env.NODE_ENV = 'test';

const assert = require('assert');
const util = require('util');
const TEST_CONSTANTS = require('./test-constants').CONSTANTS;

const MediaItem = require('../media-item').MediaItem;

describe('MediaItem Class', () => {

    describe('Sanity Check', () => {

        it('should be not defined without a source file', (done) => {

            const mediaItem = new MediaItem();
            assert.notEqual(undefined, mediaItem);
            assert.notEqual(null, mediaItem)
            done();
        });
    });

    describe('Media Item Creation', () => {

        it('should store to source path', (done) => {

            const sourcePath = '/tmp/some/file.mov';
            const mediaItem = new MediaItem(sourcePath);
            assert.deepStrictEqual(sourcePath, mediaItem.sourceFile);
            done();
        });
    });

    describe('Source Media Info - Video', () => {

        const TEST_FILE = `${__dirname}/${TEST_CONSTANTS.VIDEO_640_480_PATH}`;
        const TEST_FPS = 30.0464643791;

        it('should find the source source file', (done) => {

            const mediaItem = new MediaItem(TEST_FILE);
            assert.deepStrictEqual(TEST_FILE, mediaItem.sourceFile);
            assert.strictEqual(true, mediaItem.exists());
            done();
        });

        it('should load video meta data - video: h264, audio: aac', (done) => {

            // test meta data originally captured with ffprobe
            const mediaItem = new MediaItem(TEST_FILE);
            assert.deepStrictEqual(TEST_FILE, mediaItem.sourceFile)
            assert.notEqual(undefined, mediaItem.metaData)
            assert.ok(mediaItem.hasVideo());
            assert.ok(mediaItem.hasAudio());
            assert(Math.abs(TEST_FPS - mediaItem.fps()) <= TEST_CONSTANTS.ELLIPSIS);
            assert(mediaItem.bitRate() > 0);
            assert.strictEqual(TEST_CONSTANTS.VIDEO_H264_CODEC, mediaItem.videoCodec());
            assert.strictEqual(TEST_CONSTANTS.AUDIO_CODEC_AAC, mediaItem.audioCodec());
            assert(Math.abs(TEST_CONSTANTS.VIDEO_64_DURATION - mediaItem.duration()) <= TEST_CONSTANTS.ELLIPSIS);
            done();
        });

        it.only('should not have any meta data - bad video file', (done) => {

            const TEST_BAD_VIDEO_FILE = TEST_CONSTANTS.BAD_VIDEO.FILE_PATH;
            const mediaItem = new MediaItem(TEST_BAD_VIDEO_FILE);
            assert.deepStrictEqual(TEST_BAD_VIDEO_FILE, mediaItem.sourceFile);
            assert.strictEqual({}, mediaItem.metaData);

            done();
        });
    });
});
