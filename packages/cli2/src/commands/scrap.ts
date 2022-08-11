import { CloudFormationDeployments } from "aws-cdk/lib/api/cloudformation-deployments.js";
import * as cxapi from "@aws-cdk/cx-api";
import { App, Stack } from "aws-cdk-lib";
import cdklib from "aws-cdk/lib/index.js";
const { SdkProvider } = cdklib;
import { useConfig } from "../config/index.js";

export async function Scrap() {
  const app = new App();
  const stack = new Stack(app, "my-stack");
  const synthesized = app.synth();
  const artifact = synthesized.stacks[0];
  const sdkProvider = await SdkProvider.withAwsCliCompatibleDefaults(
    await useConfig()
  );
  const cfn = new CloudFormationDeployments({ sdkProvider: sdkProvider });
  const deployResult = await cfn.deployStack({
    stack: artifact as any,
    quiet: true,
    force: true
  });
}
