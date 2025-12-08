import * as UpChunk from '@mux/upchunk';

// Helper function to handle single upload
const performUpload = (url, file, setUploadProgress) => {
  return new Promise((resolve, reject) => {
    const upload = UpChunk.createUpload({
      endpoint: url,
      file: file,
      chunkSize: 5120, // 5MB chunks for optimal performance
    });

    upload.on('progress', progress => {
      const percent = Math.round(progress.detail);
      setUploadProgress(percent);
    });

    upload.on('success', () => {
      setUploadProgress(100);
      resolve();
    });

    upload.on('error', err => {
      reject(err);
    });
  });
};

export { performUpload };
