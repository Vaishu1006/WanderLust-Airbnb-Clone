const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// optional: test if dotenv worked
//console.log("Cloudinary Secret:", process.env.CLOUDINARY_SECRET);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "WanderLust_DEV",
        allowed_formats: ["jpeg", "png", "jpg"],
    }
});

module.exports = { cloudinary, storage };
