import { PostConfirmationConfirmSignUpTriggerEvent } from "aws-lambda";
import { ulid } from "ulidx";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

exports.handler = async (event: PostConfirmationConfirmSignUpTriggerEvent) => {
  const id = ulid();
  const date = new Date().toISOString();

  console.log("Event...", JSON.stringify(event, null, 2));
  try {
    await client.send(
      new PutItemCommand({
        TableName: "Users",
        Item: marshall({
          UserID: id,
          createdAt: date,
          email: event.request.userAttributes.email,
          name: event.request.userAttributes.name,
          username: event.userName,
        }),
        ConditionExpression:
          "attribute_not_exists(UserID) and attribute_not_exists(email) and attribute_not_exists(username)",
      })
    );
  } catch (error) {
    console.log("Could not complete");
    throw error;
  }
};
