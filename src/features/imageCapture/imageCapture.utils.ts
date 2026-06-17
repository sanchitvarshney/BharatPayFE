export const dataUrlToFile = (dataUrl: string, filename: string): File => {
  const [meta, base64 = ""] = dataUrl.split(",");
  const mime = meta.match(/:(.*?);/)?.[1] ?? "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], filename, { type: mime });
};

export const buildCaptureFormData = (
  images: Record<string, string>,
  extra?: Record<string, string>
): FormData => {
  const formData = new FormData();
  if (extra) {
    Object.entries(extra).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }
  Object.entries(images).forEach(([field, dataUrl]) => {
    if (!dataUrl) return;
    formData.append(field, dataUrlToFile(dataUrl, `${field}.png`));
  });
  return formData;
};
