const { parallel } = require("gulp");
import { spawn } from "child_process";
import { cdkStacks } from "./cdk/cdk";

async function spa() {
  console.log("11111111111111111");
  await processStack();
  console.log("22222222222222222");
  await processStack();
  console.log("33333333333333333");
}

async function processStack() {
  return new Promise((request: any, resolve: any) => {
    for (const command of cdkStacks) {
      console.log(command.dependencies[0]?.stackName );
      // console.log(
      //   command.stack.dependencies.length
      //     ? command.stack.dependencies[0].stackName
      //     : ""
      // );
      const ls = spawn("cdk", [
        "deploy",
        command.stackName,
        "--require-approval",
        "never",
      ]);

      ls.stdout.on("data", (data: any) => {
        console.log(`stdout: ${data}`);
      });

      ls.stderr.on("data", (data: any) => {
        console.log(`stderr: ${data}`);
      });

      ls.on("error", (error: any) => {
        console.log(`error: ${error.message}`);
      });

      ls.on("close", (code: any) => {
        console.log(`child process exited with code ${code}`);
      });
    }
  });
}

const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default parallel(spa);
