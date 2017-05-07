'use strict';

if ( process.env.NODE_ENV !== 'test' ) process.env.NODE_ENV = 'test';

const assert  = require('assert');
const fs = require('fs');

const ffmpeg = require('../ffmpeg');
const TEST_CONSTANTS = require('./test-constants').CONSTANTS;

describe('FFPROBE INFO', () => {

    describe('Video Meta Data', () => {

        it('should return an empty object from an empty string.', (done) => {
            assert.deepStrictEqual({}, ffmpeg.parseFFPROBEData(''));
            done();
        });

        it('should return an empty object from undefined arguments', (done) => {
            assert.deepStrictEqual({}, ffmpeg.parseFFPROBEData());
            done();
        });

        it('should return an empty object when null is passed', (done) => {
            assert.deepStrictEqual({}, ffmpeg.parseFFPROBEData(null));
            done();
        });

        it('should return an empty object when an invalid JSON string is passed', (done) => {

            assert.doesNotThrow(
                () => {
                assert.deepStrictEqual({}, ffmpeg.parseFFPROBEData('hello, world'));
                },
                SyntaxError);

            done();
        });

        const VIDEO_FFPROBE_FILE = `${__dirname}/files/ffprobe.video.info.txt`;

        it('should return valid video meta data', (done) => {

            fs.readFile(VIDEO_FFPROBE_FILE, 'utf8', (err, data) => {

                if ( err ) done(err);

                const metaData = ffmpeg.parseFFPROBEData(data);
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

        const AUDIO_FFPROBE_FILE = `${__dirname}/files/ffprobe.audio.info.txt`;

        it('should return valid audio meta data', (done) => {

            fs.readFile(AUDIO_FFPROBE_FILE, 'utf8', (err, data) => {

                if ( err ) {
                    done(err);
                    return;
                }

                const metaData = ffmpeg.parseFFPROBEData(data);
                assert.strictEqual(false, metaData.has_video);
                assert.strictEqual(null, metaData.video_codec);
                assert.strictEqual(0, metaData.width);
                assert.strictEqual(0, metaData.height);
                assert(Math.abs(TEST_CONSTANTS.OWL_AUDIO_DURATION - metaData.duration) <= TEST_CONSTANTS.ELLIPSIS);
                assert(metaData.bit_rate > 0);
                assert(metaData.file_size > 0);
                assert.strictEqual(TEST_CONSTANTS.AUDIO_CODEC_PCM_S16BE, metaData.audio_codec);
                assert(metaData.has_audio);

                done();
            });
        });

        const INVALID_FFPROBE_FILE = `${__dirname}/files/ffprobe.invalid.media.info.txt`;

        it('should return false for \'has_video\' and \'has_audio.\'', (done) => {

            fs.readFile(INVALID_FFPROBE_FILE, 'utf8', (err, data) => {

                if ( err ) {
                    done(err);
                    return;
                }

                const metaData = ffmpeg.parseFFPROBEData(data);
                assert.strictEqual(false, metaData.has_video);
                assert.strictEqual(false, metaData.has_audio);

                done();
            });

        });
    });
});
