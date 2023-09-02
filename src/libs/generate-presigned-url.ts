import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const generatePresignedUrl = (
  key: string,
  s3: S3Client
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: "s3-uploaded-files",
    Key: key,
  });
  return getSignedUrl(s3, command, { expiresIn: 5 * 60 * 60 });
};
