import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import { join } from "path";

interface AddUserLambdaStackProps extends cdk.StackProps {
  table: Table;
}

export class AddUserLambdaStack extends cdk.Stack {
  readonly addUserToTableFunc: NodejsFunction;

  constructor(scope: Construct, id: string, props: AddUserLambdaStackProps) {
    super(scope, id, props);

    this.addUserToTableFunc = new NodejsFunction(this, "addUserLambdaFunc", {
      runtime: Runtime.NODEJS_16_X,
      entry: join(__dirname, "../functions/AddUserPostConfirmation/index.ts"),
      handler: "handler",
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });
    props.table.grantReadWriteData(this.addUserToTableFunc);
  }
}
