import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AttributeType,
  BillingMode,
  ProjectionType,
  Table,
} from "aws-cdk-lib/aws-dynamodb";

interface DatabaseStackProps extends cdk.StackProps {
  removalPolicy: cdk.RemovalPolicy;
}

export class DatabaseStack extends cdk.Stack {
  public readonly usersTable: Table;
  public readonly flightsTable: Table;
  public readonly seatsTable: Table;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    this.usersTable = new Table(this, "UsersTable", {
      partitionKey: { name: "UserID", type: AttributeType.STRING },
      tableName: "Users",
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: props.removalPolicy,
    });

    this.usersTable.addGlobalSecondaryIndex({
      indexName: "usernameIndex",
      partitionKey: { name: "username", type: AttributeType.STRING },
    });

    this.flightsTable = new Table(this, "FlightsTable", {
      partitionKey: { name: "FlightID", type: AttributeType.STRING },
      tableName: "Flights",
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: props.removalPolicy,
    });

    this.seatsTable = new Table(this, "SeatsTable", {
      tableName: "SeatBooking",
      partitionKey: { name: "SeatID", type: AttributeType.STRING },
      sortKey: { name: "FlightID", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: props.removalPolicy,
    });

    this.seatsTable.addGlobalSecondaryIndex({
      indexName: "flightIDIndex",
      partitionKey: { name: "FlightID", type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.seatsTable.addGlobalSecondaryIndex({
      indexName: "isBookedIndex",
      partitionKey: { name: "isBooked", type: AttributeType.STRING },
    });
  }
}
