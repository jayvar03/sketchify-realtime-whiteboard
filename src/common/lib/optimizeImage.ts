import Resizer from "react-image-file-resizer";

export const optimizeImage = (file: File, callback: (uri: string) => void) => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type. Please select an image file.');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('File size too large. Please select a file smaller than 10MB.');
      return;
    }

    Resizer.imageFileResizer(
      file,
      800,
      800,
      "PNG",
      100,
      0,
      (uri) => {
        try {
          if (typeof uri === 'string') {
            callback(uri);
          } else {
            console.error('Failed to process image');
          }
        } catch (error) {
          console.error('Error in image callback:', error);
        }
      },
      "base64"
    );
  } catch (error) {
    console.error('Error optimizing image:', error);
  }
};
