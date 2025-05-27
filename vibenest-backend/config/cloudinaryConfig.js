import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Налаштування для аудіо файлів
const audioStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'vibenest/audio',
        resource_type: 'auto',
        allowed_formats: ['mp3', 'wav'],
        format: 'mp3'
    }
});

// Налаштування для зображень
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'vibenest/images',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

// Створюємо multer middleware для різних типів файлів
export const uploadAudio = multer({ storage: audioStorage });
export const uploadImage = multer({ storage: imageStorage });

// Функція для отримання URL з Cloudinary
export const getCloudinaryUrl = (file) => {
    if (!file) return null;
    return file.path; // Cloudinary Storage автоматично повертає URL в path
}; 