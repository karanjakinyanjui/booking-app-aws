#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AirportAppStack } from "../lib/airport-app-stack";
import { DatabaseStack } from "../lib/database-stack";
import { AddUserLambdaStack } from "../lib/lambda-confirm.stack";
import { AuthStack } from "../lib/auth-stack";

const app = new cdk.App();

const databaseStack = new DatabaseStack(app, "DatabaseStack", {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const addUserLambdaFunc = new AddUserLambdaStack(app, "AddUserLambdaStack", {
  table: databaseStack.usersTable,
});

const authStack = new AuthStack(app, "AuthStack", {
  addUserPostConfirmation: addUserLambdaFunc.addUserToTableFunc,
});
