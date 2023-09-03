import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import * as dotenv from 'dotenv';
dotenv.config();
const sesClient = new SESClient({ region: process.env.AWS_REGION });

const notification: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  const params = {
    Destination: {
      ToAddresses: [event.body.email],
    },
    Message: {
      Body: {
        Text: { Data: event.body.message.text },
      },
      Subject: { Data: event.body.message.subject },
    },
    Source: 'rajeeb.abdul@sourcefuse.com',
  };

  await sesClient.send(new SendEmailCommand(params));

  return formatJSONResponse({
    message: 'Email send succesfully',
  });
};

export const main = middyfy(notification);
