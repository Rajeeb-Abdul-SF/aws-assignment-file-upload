import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
import { parseCSV } from "@libs/parse-csv";
import { generatePresignedUrl } from "@libs/generate-presigned-url";
import { S3Client } from "@aws-sdk/client-s3";
import axios from "axios";

const s3 = new S3Client({ region: "us-east-1" });

const s3Handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  // Created a presigned URL
  const url = await generatePresignedUrl(event.body.key, s3);

  // Parse the CSV data
  const csvData = await parseCSV(url);

  axios
    .post("http://localhost:3000/dev/user", { user: csvData })
    .catch((error) => {
      console.log(error);
    });

  return formatJSONResponse({
    csvData,
  });
};

export const main = middyfy(s3Handler);
