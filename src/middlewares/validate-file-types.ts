import { File, HttpError } from '@libs/api-gateway';

const isAllowedFileType = (fileName: string) => {
  const allowedExtensions = ['.csv'];

  const fileExtension = fileName.slice(
    ((fileName.lastIndexOf('.') - 1) >>> 0) + 2,
  );
  return allowedExtensions.includes(`.${fileExtension.toLowerCase()}`);
};

// Middleware function
export const fileTypeChecker = () => {
  return {
    before: async (handler) => {
      const { event } = handler;
      const file: File = event.body.file;

      if (!isAllowedFileType(file.filename)) {
        return HttpError(422, 'File Type is not supported');
      }
    },
  };
};
