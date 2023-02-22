import { Resource, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export const cdkStacks: Stack[] = [];

export class BaseStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    /**
     * To get a list of stacks
     */
    cdkStacks.push(this);
    if (props) {
      /**
       * Add dependencies to stacks
       */
      for (const resource of Object.values(props)) {
        if (resource instanceof Resource) this.addDependency(resource.stack);
      }
    }
  }
}
