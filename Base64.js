// Base64.js

const sharp = require("sharp");
const request = require("request-promise");

async function convertPngToJpeg(imageUrl) {
  try {
    const pngBuffer = await request.get({ url: imageUrl, encoding: null });
    const jpegBuffer = await sharp(pngBuffer).jpeg({ quality: 90 }).toBuffer();
    const base64String = jpegBuffer.toString("base64");
    return base64String;
  } catch (error) {
    throw new Error("Error converting PNG to JPEG:", error);
  }
}

module.exports = { convertPngToJpeg };
