const chalk = require("chalk");
const { spawn } = require("child_process");

export const deployStacks = async (stacks: string[]) => {
  try {
    let arrPromises = [];
    for (let stackName of stacks) {
      arrPromises.push(
        CommandExec(
          "cdk",
          stackName,
        //   paths.workingDir,
        //   true,
        //   process.env,
        //   `[${stackName}] `
        )
      );
    }
    await Promise.all(arrPromises);

    // callback();
  } catch (e) {
    // callback(e);
  }
};
export const CommandExec = (
  command: string,
  args: string
  //   cwd: any,
  //   echoOutputs = true,
  //   env: any = null,
  //   prefixOutputs = ""
) => {
  //   try {
  //     // if (!env) env = process.env;

  return new Promise((resolve, reject) => {
    let allData = "";
    //   console.log(chalk.green(">>>", command + " " + args));
    // console.log( chalk.green(">>>", command +" "+ args, "["+cwd+"]"));
    const call = spawn(command, [
      "deploy",
      "-e",
      args,
      "--require-approval",
      "never",
    ]);
    let errOutput: any = null;

    call.stdout.on("data", function (data: any) {
      allData += data.toString();
      process.stdout.write(args + data.toString());
    });
    call.stderr.on("data", function (data: any) {
      errOutput = data.toString();
      process.stdout.write(data.toString());
    });
    call.on("exit", function (code: any) {
      if (code == 0) resolve(allData);
      else reject(errOutput);
    });
  });
  //   } catch (e) {
  //     return Promise.reject(e);
  //   }
};