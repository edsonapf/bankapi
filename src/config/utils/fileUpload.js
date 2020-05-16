import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import env from '../env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
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
