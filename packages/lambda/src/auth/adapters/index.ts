import { APIGatewayProxyResultV2 } from "aws-lambda";

export interface AdapterMetadata {}

export interface Adapter {}

export function define<Type extends keyof AdapterMetadata>(
  _type: Type,
  adapter: (config: AdapterMetadata[Type]["config"]) => {
    start(): Promise<APIGatewayProxyResultV2>;
  }
) {
  return adapter;
}
