import middy from '@middy/core';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import httpMultipartBodyParser from '@middy/http-multipart-body-parser';
import { fileTypeChecker } from 'src/middlewares/validate-file-types';

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser());
};

export const middymultipart = (handler) => {
  return middy(handler)
    .use(httpHeaderNormalizer())
    .use(httpMultipartBodyParser())
    .use(fileTypeChecker());
};
