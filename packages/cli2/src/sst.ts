import chalk from "chalk";
import { VisibleError } from "./error/index.js";

console.time("cli");
process.on("uncaughtException", err => {
  console.log("");
  console.log(chalk.red(err.message));
  console.log(
    chalk.blue(
      "Need help with this error? Join our discord https://discord.gg/sst and talk to the team"
    )
  );
  console.log("");
  if (!(err instanceof VisibleError)) {
    console.log(chalk.yellow(err.stack));
  }
});

process.on("beforeExit", () => {
  console.timeEnd("cli");
});

import caporal from "@caporal/core";
import { Update } from "./commands/update.js";
import { Scrap } from "./commands/scrap.js";
const { program } = caporal;

program
  .disableGlobalOption("silent")
  .disableGlobalOption("quiet")
  .disableGlobalOption("verbose")
  .disableGlobalOption("--no-color");

program
  .command("update", "Update SST and CDK packages to another version")
  .argument("[version]", "Optional version to update to")
  .action(req => {
    Update({
      version: req.args.version?.toString()
    });
  });

program.command("scrap", "Used to test arbitrary code").action(req => {
  Scrap();
});

program.run();
