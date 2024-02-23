import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_cognito as Cognito } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

interface AuthStackProps extends cdk.StackProps {
  addUserPostConfirmation: NodejsFunction;
}

export class AuthStack extends cdk.Stack {
  public readonly userPool: Cognito.UserPool;
  public readonly userPoolClient: Cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    this.userPool = new Cognito.UserPool(this, "UserPool", {
      userPoolName: "AirportAppUserPool",
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      signInAliases: { email: true },
      standardAttributes: {
        email: { required: true },
      },

      passwordPolicy: {
        minLength: 8,
        requireLowercase: false,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false,
      },

      customAttributes: {
        name: new Cognito.StringAttribute({
          minLen: 3,
          maxLen: 256,
        }),
      },

      lambdaTriggers: {
        postConfirmation: props.addUserPostConfirmation,
      },
    });

    this.userPoolClient = new Cognito.UserPoolClient(this, "UserPoolClient", {
      userPool: this.userPool,
      authFlows: { userPassword: true },
    });

    new cdk.CfnOutput(this, "UserPoolId", { value: this.userPool.userPoolId });
  }
}
