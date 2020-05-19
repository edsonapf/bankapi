import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = cloudinaryStorage({
  cloudinary,
  folder: 'fbank',
  allowedFormats: ['jpg', 'png'],
  filename: (req, file, cb) => {
    const { originalname } = file;
    const { user_id } = req.params;
    let name = `${originalname.split('.')[0]}_${user_id}_${new Date().getTime()}`;
    console.log(name);
    cb(undefined, name);
  }
});
const upload = multer({ storage });

export default upload;
