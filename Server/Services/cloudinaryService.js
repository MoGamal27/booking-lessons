const { Readable } = require('stream');
const cloudinary = require('../Config/cloudinaryConfig');

const uploadToCloudinary = async (fileBuffer, resourceType = 'auto') => {
  try {
    const stream = Readable.from(fileBuffer);
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType, folder: 'videos' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );

      stream.pipe(uploadStream);
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
module.exports = { uploadToCloudinary };
