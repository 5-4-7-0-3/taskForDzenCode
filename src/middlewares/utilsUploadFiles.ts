import * as uuid from 'uuid';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

export const processFile = async (file: Express.Multer.File): Promise<Express.Multer.File> => {
    const allowedImageFormats = /\.(jpg|jpeg|png|gif)$/i;
    const allowedTextFormats = /\.txt$/i;

    if (allowedImageFormats.test(file.originalname) && file.mimetype.startsWith('image/')) {
        const maxWidth = 320;
        const maxHeight = 240;

        const metadata = await sharp(file.buffer).metadata();

        if (metadata.width > maxWidth || metadata.height > maxHeight) {
            const resizedBuffer = await sharp(file.buffer).resize(maxWidth, maxHeight).toBuffer();

            return {
                ...file,
                buffer: resizedBuffer,
                filename: generateFileName(file.originalname),
            };
        }
    } else if (allowedTextFormats.test(file.originalname) && file.mimetype === 'text/plain') {
        const maxSizeInBytes = 100 * 1024;

        if (file.size <= maxSizeInBytes) {
            return {
                ...file,
                filename: generateFileName(file.originalname),
            };
        } else {
            throw new Error('The text file must not exceed 100 KB');
        }
    }

    throw new Error('Invalid file type');
};

const generateFileName = (originalname: string): string => {
    const uniqueSuffix = uuid.v4();
    const extension = path.extname(originalname);
    const nameWithoutExtension = originalname.replace(extension, '');
    return `${nameWithoutExtension}-${uniqueSuffix}${extension}`;
};

export const saveFile = async (file: Express.Multer.File) => {
    const uploadFolderPath = path.join(__dirname,'../..', 'uploads');
    const filePath = path.join(uploadFolderPath, file.filename);

    if (!fs.existsSync(uploadFolderPath)) {
        fs.mkdirSync(uploadFolderPath, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);
    return filePath;
};

export const fileExists = async (path: string): Promise<boolean> => {
    return new Promise((resolve) => {
      fs.createReadStream(path)
        .on('error', () => resolve(false))
        .on('data', () => resolve(true));
    });
  };