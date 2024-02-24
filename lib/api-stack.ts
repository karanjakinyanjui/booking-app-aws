import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  MethodLoggingLevel,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";

interface ApiStackProps extends cdk.StackProps {
  userPool: IUserPool;
  bookingLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends cdk.Stack {
  public readonly api: RestApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    this.api = new RestApi(this, "Api", {
      deployOptions: {
        loggingLevel: MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },
    });

    this.api.root.addMethod("ANY");
  }
}
