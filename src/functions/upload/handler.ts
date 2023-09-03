import {
  HttpError,
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from '@libs/api-gateway';
import { middymultipart } from '@libs/lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import schema from './schema';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();
const s3 = new S3Client({ region: process.env.AWS_REGION });

const upload: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  const file = event.body.file;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: file.filename,
    Body: file.content,
  };

  const data = await s3.send(new PutObjectCommand(params));
  if (!data.ETag) {
    return HttpError(400, 'Failed to upload item.');
  }

  axios.post(process.env.S3_SERVICE_URL, { key: file.filename });

  return formatJSONResponse({
    data,
  });
};

export const main = middymultipart(upload);
