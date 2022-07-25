import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

export function createAdapter<A extends Adapter>(adapter: A) {
  return adapter;
}

export interface Adapters {}

export type AdaptersUnion = Adapters[keyof Adapters];

export interface Adapter {
  handle: (config: any) => Promise<APIGatewayProxyStructuredResultV2>;
}

export type Provider<A extends AdaptersUnion> = {
  adapter: A;
  config: Parameters<A["handle"]>[0];
};
