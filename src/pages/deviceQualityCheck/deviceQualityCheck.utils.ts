export const MAX_PHOTOS = 4;

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.8;

// Phone camera photos are large (4–10 MB); downscale + re-encode before upload.
// Falls back to the original file if the browser can't decode it.
export const compressPhoto = (file: File): Promise<File> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob || blob.size >= file.size) return resolve(file);
          const name = file.name.replace(/\.[^.]+$/, "") || "photo";
          resolve(new File([blob], `${name}.jpg`, { type: "image/jpeg" }));
        },
        "image/jpeg",
        JPEG_QUALITY,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
