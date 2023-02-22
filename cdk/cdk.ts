#!/usr/bin/env node
import "./env";
import {
  App,
  RemovalPolicy,
  Stack,
  CfnOutput,
  AppProps,
  StackProps,
} from "aws-cdk-lib";
import {Resource} from "aws-cdk-lib/core"
import { Construct } from "constructs";
import path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

export const cdkStacks: Stack[] = []
/**
 * Backend Stack deploys Nodejs application as Lambda and create's a Rest Api
 */
class BackendStack extends Stack {
  public lambdaRestApi: LambdaRestApi;
  public bucket = new Bucket(this, "react-bucket", {
    publicReadAccess: true,
    websiteIndexDocument: "index.html",
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });
  constructor(scope: Construct, id: string) {
    super(scope, id);
    cdkStacks.push(this);

    /**
     * Create a new Lambda Function
     */
    const lambda = new NodejsFunction(this, "backend-lambda", {
      entry: path.resolve(__dirname, "backend/index.js"),
      memorySize: 128,
    });

    /**
     * Create a Rest Api for Lambda
     */
    this.lambdaRestApi = new LambdaRestApi(this, "rest-api", {
      handler: lambda,
    });
  }
}

interface Propps extends StackProps {
  bucket: Bucket;
}
/**
 * Frontend Stack deploy's React application in S3 Bucket
 */
class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props: Propps) {
    super(scope, id, props);
    cdkStacks.push(this);
    for (const [key, value] of Object.entries(props)) {
      if (value instanceof Resource)
        this.addDependency(value.stack)
    }
    /**
     * Create new S3 Bucket
     */

    /**
     * Deploy React application in S3 Bucket
     */
    new BucketDeployment(this, "react-deploy", {
      destinationBucket: props.bucket,
      sources: [Source.asset("./cdk/frontend/build")],
    });

    /**
     * Prints the s3 bucket website url in the console
     */
    new CfnOutput(this, "s3-bucket-website-url", {
      value: props.bucket.bucketWebsiteUrl,
    });
  }
}
const app = new App();

/**
 * Create a instance of Backend and Frontend Stack
 */
// const main=() => {
//  export class FalconApp extends App {
//    constructor(props?: AppProps) {
//      super(props);
export const backendStack = new BackendStack(app, "backend");
export const backendStack1 = new BackendStack(app, "backend1")
export const frontendStack = new FrontendStack(app, "frontend", {
  bucket: backendStack.bucket,
});
console.log(frontendStack.dependencies.length);
//    }
//  }
// }

// main();
