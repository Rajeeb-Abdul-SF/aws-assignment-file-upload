import {
  HttpError,
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@libs/api-gateway";
import { middymultipart } from "@libs/lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import schema from "./schema";
import { parseCSV } from "@libs/parse-csv";
import { generatePresignedUrl } from "@libs/generate-presigned-url";
import axios from "axios";

const s3 = new S3Client({ region: "us-east-1" });

const upload: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const file = event.body.file;

  const params = {
    Bucket: "s3-uploaded-files",
    Key: file.filename,
    Body: file.content,
  };

  const data = await s3.send(new PutObjectCommand(params));
  if (!data.ETag) {
    return HttpError(400, "Failed to upload item.");
  }

  axios.post(" http://localhost:3000/dev/s3", { key: file.filename });

  return formatJSONResponse({
    data,
  });
};

export const main = middymultipart(upload);
