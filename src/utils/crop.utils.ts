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

export const getCroppedImg = async (
    imageSrc: string,
    _pixelCrop: Area, // not needed now
    rotation = 0
): Promise<Blob> => {

    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.crossOrigin = "anonymous";
        img.src = imageSrc;
    });

    const FINAL_WIDTH = 1080;
    const FINAL_HEIGHT = 1920;
    const rotRad = (rotation * Math.PI) / 180;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2d context");

    canvas.width = FINAL_WIDTH;
    canvas.height = FINAL_HEIGHT;

    ctx.save();

    // Move to center
    ctx.translate(FINAL_WIDTH / 2, FINAL_HEIGHT / 2);
    ctx.rotate(rotRad);

    // COVER logic (like CSS background-size: cover)
    const imgRatio = image.width / image.height;
    const canvasRatio = FINAL_WIDTH / FINAL_HEIGHT;

    let drawWidth = FINAL_WIDTH;
    let drawHeight = FINAL_HEIGHT;

    if (imgRatio > canvasRatio) {
        // Image is wider
        drawHeight = FINAL_HEIGHT;
        drawWidth = FINAL_HEIGHT * imgRatio;
    } else {
        // Image is taller
        drawWidth = FINAL_WIDTH;
        drawHeight = FINAL_WIDTH / imgRatio;
    }

    ctx.drawImage(
        image,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
    );

    ctx.restore();

    return new Promise((resolve) => {
        canvas.toBlob((file) => {
            if (!file) throw new Error("Blob failed");
            resolve(file);
        }, "image/jpeg", 0.95);
    });
};