import { App, AppProps, Resource, Stack, StackProps } from "aws-cdk-lib";

export const cdkStacks: Stack[] = [];

export class BaseApp extends App {
  public stacks: Stack[] = []
  constructor(props?: AppProps) {
    super(props);
  }

  pushStackInfo(stack: Stack) {
    this.stacks.push(stack);
  }
}

export class BaseStack extends Stack {
  constructor(scope: BaseApp, id: string, props?: StackProps) {
    super(scope, id, props);
    scope.pushStackInfo(this);
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
