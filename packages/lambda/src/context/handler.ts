import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context as LambdaContext,
  SQSBatchResponse,
  SQSEvent
} from "aws-lambda";
import { Context } from "./context.js";

interface Handlers {
  api: {
    event: APIGatewayProxyEventV2;
    response: APIGatewayProxyStructuredResultV2;
  };
  sqs: {
    event: SQSEvent;
    response: SQSBatchResponse;
  };
}

type HandlerTypes = keyof Handlers;

type Events = {
  [key in HandlerTypes]: {
    type: key;
    event: Handlers[key]["event"];
  };
}[HandlerTypes];

const EventContext = Context.create<Events>();

export function useEvent<Type extends HandlerTypes>(type: Type) {
  const ctx = EventContext.use();
  if (ctx.type !== type) throw new Error(`Expected ${type} event`);
  return ctx.event as Handlers[Type]["event"];
}

export function Handler<
  Type extends HandlerTypes,
  Event = Handlers[Type]["event"],
  Response = Handlers[Type]["response"]
>(type: Type, cb: (evt: Event, ctx: LambdaContext) => Promise<Response>) {
  return function handler(event: Event, context: LambdaContext) {
    EventContext.provide({ type, event } as any);
    return cb(event, context);
  };
}
