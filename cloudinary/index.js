const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Dext Images',
    allowedFormats: ['jpeg', 'png', 'jpg'],
    width: 600,
    height: 600,
    crop: 'limit',
  },
});

const storagedp = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Dext Profile Images',
    allowedFormats: ['jpeg', 'png', 'jpg'],
    width: 150,
    height: 150,
    crop: 'limit',
  },
});

module.exports = {
  cloudinary,
  storage,
  storagedp,
};
