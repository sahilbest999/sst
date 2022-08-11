import { Stacks } from "../stacks";

export async function Build() {
  console.time("first");
  console.log(await Stacks.build());
  console.timeEnd("first");

  console.time("second");
  console.log(await Stacks.build());
  console.timeEnd("second");
}
