import { MessageStack } from "./MessageStack";
import { App } from "@serverless-stack/resources";
import { ResourceStack } from "./ResourceStack";

export default function (app: App) {

  const environment: {[k: string]: any} = { 
    REGION: process.env.REGION,
  }

  app.setDefaultFunctionProps({
    environment: environment,
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm",
    },
  });
  app
    .stack(ResourceStack)
    .stack(MessageStack);
}
