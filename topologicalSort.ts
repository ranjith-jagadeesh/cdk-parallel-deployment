import { cdkStacks } from "./cdk/cdk";
import { deployStacks } from "./deploy";
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
  // deployAndRemoveDependency(nonDependantStacks);
};

export const deployAndRemoveDependency = async (stacks: string[]) => {
  await deployStacks(stacks);
  const nonDependantStacks: string[] = [];
  while (stacks.length) {
    const stackName = stacks.pop() as string;
    for (const [key, value] of map) {
      value.delete(stackName);
      if (value.size) map.set(key, value);
      else nonDependantStacks.push(key as string);
    }
  }
  await deployAndRemoveDependency(nonDependantStacks);
};
