import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import {
  BatchWriteItemCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import { User } from 'src/models';
import schema from './schema';

const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });

const user: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  const body = event.body.user as User[];

  const putRequests = body.map((item: User) => {
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
  await dynamoDBClient.send(batchWriteCommand).catch((error) => {
    console.error('Error:', error);
  });

  return formatJSONResponse({
    message: 'User created succesfully',
  });
};

export const main = middyfy(user);
