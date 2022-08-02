import { ExecutionContext, FormatPayloadParams } from "graphql-helix";
import { Context, APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { GraphQLSchema } from "graphql";
import { IExecutableSchemaDefinition } from "@graphql-tools/schema";
declare type HandlerConfig<C> = {
    formatPayload?: (params: FormatPayloadParams<C, any>) => any;
    context?: (request: {
        event: APIGatewayProxyEventV2;
        context: Context;
        execution: ExecutionContext;
    }) => Promise<C>;
} & ({
    schema: GraphQLSchema;
} | {
    resolvers: IExecutableSchemaDefinition<C>["resolvers"];
    typeDefs: IExecutableSchemaDefinition<C>["typeDefs"];
});
export declare function createGQLHandler<T>(config: HandlerConfig<T>): APIGatewayProxyHandlerV2<never>;
export {};
