#!/usr/bin/env node
import "./env";
import { StackProps } from "aws-cdk-lib";
import path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { BaseStack, BaseApp } from "./base_stack";
import { Construct } from "constructs";


class InfraStack extends BaseStack {
  public table = new Table(this, "table", {
    partitionKey: { name: "pk", type: AttributeType.STRING },
  });
}

interface ServiceStackProps extends StackProps {
  table: Table;
}

class ServiceStack extends BaseStack {
  constructor(scope: Construct, id: string, props: ServiceStackProps) {
    super(scope, id, props);

    const lambda = new NodejsFunction(this, "backend-lambda", {
      entry: path.resolve(__dirname, "lambda/index.js"),
      memorySize: 128,
    });
    props.table.grantReadData(lambda);
  }
}

export const app = new BaseApp();

export const backendStack = new InfraStack(app, "infra");
export const backendStack1 = new InfraStack(app, "infra1");
export const frontendStack = new ServiceStack(app, "service", {
  table: backendStack.table,
});
