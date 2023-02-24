import { App, AppProps, Resource, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export class BaseApp extends App {
  public stacks: Stack[] = [];
  constructor(props?: AppProps) {
    super(props);
  }

  public pushStackInfo(stack: Stack) {
    this.stacks.push(stack);
  }
}

export class BaseStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    (scope as BaseApp).pushStackInfo(this);
    if (props) {
      /**
       * Add dependencies to stacks
       */
      this.verifyPropsAndAddDepedency(props, 1);
    }
  }

  private verifyPropsAndAddDepedency(props: any, level: number) {
    /**
     * Go to a maximum of level 10 in case of nested objects in stackProps
     */
    if (level == 10) return;
    level++;
    for (const stackProps of Object.values(props)) {
      if (stackProps instanceof Resource) this.addDependency(stackProps.stack);
      else if (stackProps instanceof Stack) this.addDependency(stackProps);
      else if (stackProps instanceof Object)
        this.verifyPropsAndAddDepedency(stackProps, level);
    }
  }
}
