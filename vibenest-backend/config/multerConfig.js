import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../uploads');
const audioDir = path.join(uploadDir, 'audio');
const imagesDir = path.join(uploadDir, 'images');

[uploadDir, audioDir, imagesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Конфігурація зберігання файлів
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Визначаємо папку в залежності від типу файлу
        const dest = file.fieldname === 'file' ? audioDir : imagesDir;
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        // Створюємо унікальне ім'я файлу
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Фільтр для перевірки типів файлів
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'file') {
        // Дозволяємо всі аудіо файли
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Тільки аудіо файли дозволені!'), false);
        }
    } else if (file.fieldname === 'image') {
        // Дозволяємо тільки зображення
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Тільки файли зображень дозволені!'), false);
        }
    } else {
        cb(new Error('Unexpected fieldname'), false);
    }
};

export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // Обмеження розміру файлу (10MB)
    }
}); 