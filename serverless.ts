import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";
import upload from "@functions/upload";
import user from "@functions/user";
import s3 from "@functions/s3";

const serverlessConfiguration: AWS = {
  service: "serverless-s3-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  // import the function via paths
  functions: { hello, upload, user, s3 },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      // MyS3Bucket: {
      //   Type: "AWS::S3::Bucket",
      //   Properties: {
      //     BucketName: "s3-uploaded-files",
      //   },
      // },
      // MyDynamoDBTable: {
      //   Type: "AWS::DynamoDB::Table",
      //   Properties: {
      //     TableName: "aws_test",
      //     AttributeDefinitions: [
      //       {
      //         AttributeName: "id",
      //         AttributeType: "S",
      //       },
      //       {
      //         AttributeName: "firstname",
      //         AttributeType: "S",
      //       },
      //       {
      //         AttributeName: "lastname",
      //         AttributeType: "S",
      //       },
      //       {
      //         AttributeName: "email",
      //         AttributeType: "S",
      //       },
      //       {
      //         AttributeName: "email2",
      //         AttributeType: "S",
      //       },
      //       {
      //         AttributeName: "profession",
      //         AttributeType: "S",
      //       },
      //       {
      //         AttributeName: "salary",
      //         AttributeType: "S",
      //       },
      //       {
      //         AttributeName: "dob",
      //         AttributeType: "S",
      //       },
      //     ],
      //     KeySchema: [
      //       {
      //         AttributeName: "id",
      //         KeyType: "HASH",
      //       },
      //     ],
      //     ProvisionedThroughput: {
      //       ReadCapacityUnits: 5,
      //       WriteCapacityUnits: 5,
      //     },
      //   },
      // },
    },
  },
};

module.exports = serverlessConfiguration;
