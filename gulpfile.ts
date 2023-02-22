import { spawn } from "child_process";
import { parallel } from "gulp";
import { cdkStacks } from "./cdk/cdk";
const map = new Map<String, Set<String>>();

export const topologicalSortAndDeploy = async () => {
  const nonDependantStacks: string[] = [];

  for (const stack of cdkStacks) {
    const { stackName } = stack;
    const set = map.get(stackName) ?? new Set<String>();
    for (const dependantStacks of stack.dependencies)
      set.add(dependantStacks.stackName);
    if (set.size) map.set(stackName, set);
  }

  for (const stack of cdkStacks) {
    const { stackName } = stack;
    if (!map.has(stackName)) nonDependantStacks.push(stackName);
  }
  deployAndRemoveDependency(nonDependantStacks);
};

export const deployAndRemoveDependency = async (stacks: string[]) => {
  await deployStacks(stacks);
  const nonDependantStacks: string[] = [];
  while (stacks.length) {
    const stackName = stacks.pop() as string;
    for (const [key, value] of map) {
      value.delete(stackName);
      if (value.size) map.set(key, value);
      else {
        nonDependantStacks.push(key as string);
        map.delete(key);
      }
    }
  }
  if (nonDependantStacks.length)
    await deployAndRemoveDependency(nonDependantStacks);
};

export const deployStacks = async (stacks: string[]) => {
  console.log("stcals", stacks);
  try {
    let arrPromises = [];
    for (let stackName of stacks) {
      arrPromises.push(CommandExec("cdk", stackName));
    }
    await Promise.all(arrPromises);

    // callback();
  } catch (e) {
    // callback(e);
  }
};

export const CommandExec = (command: string, args: string) => {
  //   try {
  //     // if (!env) env = process.env;

  return new Promise((resolve, reject) => {
    let allData = "";

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

export default parallel(topologicalSortAndDeploy);
