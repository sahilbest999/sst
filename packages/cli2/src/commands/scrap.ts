/*
import { CloudFormationDeployments } from "aws-cdk/lib/api/cloudformation-deployments.js";
import * as cxapi from "@aws-cdk/cx-api";
import { App, Stack, aws_s3 } from "aws-cdk-lib";
import cdklib from "aws-cdk/lib/index.js";
const { SdkProvider } = cdklib;
import { useConfig } from "../config/index.js";

export async function Scrap() {
  const app = new App();
  const stack = new Stack(app, "my-stack");
  new aws_s3.Bucket(stack, "bucket", {});

  const synthesized = app.synth();
  const artifact = synthesized.stacks[0];
  const sdkProvider = await SdkProvider.withAwsCliCompatibleDefaults(
    await useConfig()
  );
  const cfn = new CloudFormationDeployments({ sdkProvider: sdkProvider });
  const deployResult = await cfn.deployStack({
    stack: artifact as any,
    force: true
  });
  console.log(deployResult);
}
*/

import { useBus } from "../bus/index.js";
import { useConfig } from "../config/index.js";
import { useIOT } from "../iot/index.js";
import { requireStage } from "../state/index.js";

declare module "../bus/index.js" {
  export interface Events {
    "function.invocation": {
      functionID: string;
      env: Record<string, any>;
      event: any;
      context: any;
    };
    "function.responded": {
      type: "success";
      body: any;
    };
  }
}

export async function Scrap() {
  const iot = await useIOT();
  const bus = useBus();
  const config = await useConfig();

  bus.subscribe("function.invocation", async (evt) => {
    const stage = await requireStage();
    const topic = `/sst/${evt.properties.env.SST_APP}/${evt.properties.env.SST_STAGE}/${evt.properties.functionID}/response`;
    iot.publish(topic, "function.responded", {
      type: "success",
      body: "Hello World",
    });
  });

  console.log("Listening for function invocations...");
}
