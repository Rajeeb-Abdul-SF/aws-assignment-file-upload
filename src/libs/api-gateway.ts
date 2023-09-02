import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;
export interface File {
  filename: string;
  mimetype: string;
  encoding: string;
  truncated: boolean;
  content: {
    type: Buffer;
    data: number[];
  };
}
export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};

export const HttpError = (errorCode: number, message: string) => {
  return {
    statusCode: errorCode,
    body: JSON.stringify({ message, errorCode }),
  };
};
