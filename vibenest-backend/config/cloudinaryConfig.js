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
        format: 'mp3',
        transformation: [
            { audio_codec: 'aac' },
            { bit_rate: '128k' }
        ]
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
export const uploadAudio = multer({
    storage: audioStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Дозволені тільки аудіо файли'));
        }
    }
});

export const uploadImage = multer({
    storage: imageStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Дозволені тільки зображення'));
        }
    }
});

// Функція для отримання URL з Cloudinary
export const getCloudinaryUrl = (file) => {
    if (!file) {
        console.log('Файл відсутній');
        return null;
    }

    if (!file.path) {
        console.log('URL файлу відсутній в об\'єкті file');
        return null;
    }

    // Перевіряємо, чи URL починається з https://
    if (!file.path.startsWith('https://')) {
        console.log('Неправильний формат URL:', file.path);
        return null;
    }

    console.log('Успішно отримано URL з Cloudinary:', file.path);
    return file.path;
};