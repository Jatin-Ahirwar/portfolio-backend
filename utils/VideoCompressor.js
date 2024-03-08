const fs = require('fs');
const sharp = require('sharp');
const ffmpegPath = require('ffmpeg-static');
const { execFile } = require('child_process');

async function compressVideoBuffer(inputVideoBuffer, quality, bitrate) {
  const ffmpegCommand = [
    '-i', 'pipe:0', // Input from stdin
    '-c:v', 'libx264',
    '-b:v', `${bitrate}k`,
    '-crf', quality.toString(),
    '-f', 'mp4',
    '-movflags', 'frag_keyframe+empty_moov', // Force seekable output
    'pipe:1', // Output to stdout
  ];

  return new Promise((resolve, reject) => {
    const ffmpegProcess = execFile(ffmpegPath, ffmpegCommand, { encoding: 'binary', maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Error compressing video:', stderr);
        reject(error);
      } else {
        resolve(Buffer.from(stdout, 'binary'));
      }
    });

    ffmpegProcess.stdin.write(inputVideoBuffer, 'binary');
    ffmpegProcess.stdin.end();
  });
}

exports.VideoCompressor = async (inputVideoBuffer, quality = 30, bitrate = 1000000) => {
  try {
    const compressedBuffer = await compressVideoBuffer(inputVideoBuffer, quality, bitrate);
    console.log('Video compression successful.');
    return compressedBuffer;
  } catch (error) {
    console.error('Error compressing video:', error.message);
    throw error;
  }
};

