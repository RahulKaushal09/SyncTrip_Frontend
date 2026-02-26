import { Area } from "react-easy-crop";

export const rotateImageBase64 = async (imageSrc: string): Promise<string> => {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        // Important for handling cross-origin images if needed
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = imageSrc;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');

    // Swap width and height for a 90-degree turn
    canvas.width = image.height;
    canvas.height = image.width;

    // Translate to center, rotate, then draw back anchored at center
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((90 * Math.PI) / 180);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);

    // Return as base64 string to immediately update preview
    return canvas.toDataURL('image/jpeg', 0.9);
};

export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.setAttribute("crossOrigin", "anonymous"); // important for CORS
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
        image.src = url;
    });

export const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
): Promise<Blob> => {
    const image = await createImage(imageSrc);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("No canvas context");

    const radians = (rotation * Math.PI) / 180;

    // Set canvas size to crop size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.translate(-pixelCrop.x, -pixelCrop.y);
    ctx.translate(image.width / 2, image.height / 2);
    ctx.rotate(radians);
    ctx.translate(-image.width / 2, -image.height / 2);

    ctx.drawImage(image, 0, 0);

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (!blob) throw new Error("Canvas is empty");
            resolve(blob);
        }, "image/jpeg");
    });
};