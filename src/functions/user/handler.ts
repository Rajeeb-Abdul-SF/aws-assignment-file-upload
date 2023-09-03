import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import {
  BatchWriteItemCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import { User } from 'src/models';
import schema from './schema';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const dynamoDBClient = new DynamoDBClient({ region: process.env.AWS_REGION });

const user: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  const body = event.body.user as User[];
  const batchSize = 25;
  const batchRequestArr = [];
  for (let i = 0; i < body.length; i += batchSize) {
    const batch = body.slice(i, i + batchSize);
    const putRequests = batch.map((item: User) => {
      return {
        PutRequest: {
          Item: {
            id: { S: item.id },
            firstname: { S: item.firstname },
            lastname: { S: item.lastname },
            email: { S: item.email },
            email2: { S: item.email2 },
            profession: { S: item.profession },
            salary: { S: item.salary },
            dob: { S: item.dob.toString() },
          },
        },
      };
    });

    const batchRequest = {
      RequestItems: {
        ['aws_test']: putRequests,
      },
    };
    const batchWriteCommand = new BatchWriteItemCommand(batchRequest);
    batchRequestArr.push(dynamoDBClient.send(batchWriteCommand));
  }
  Promise.all(batchRequestArr).catch((error) => {
    console.log('DYNAMO DB CREATE ERROR OF USER CREATE', error);
  });

  const notificationPayload = {
    email: 'rajeeb.abdul@sourcefuse.com',
    message: {
      subject: 'New user batch uploaded',
      text: 'Hi Admin, New User group uploaded to database.',
    },
  };

  axios
    .post(process.env.NOTIFICATION_SERVICE_URL, notificationPayload)
    .catch((error) =>
      console.log('NOTIFICATION API ERROR OF USER CREATE', error),
    );

  return formatJSONResponse({
    message: 'User created succesfully',
  });
};

export const main = middyfy(user);
