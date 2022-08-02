import { getGraphQLParameters, processRequest, shouldRenderGraphiQL, } from "graphql-helix";
import { makeExecutableSchema, } from "@graphql-tools/schema";
export function createGQLHandler(config) {
    const schema = "schema" in config
        ? config.schema
        : makeExecutableSchema({
            typeDefs: config.typeDefs,
            resolvers: config.resolvers,
        });
    const handler = async (event, context) => {
        const request = {
            body: event.body ? JSON.parse(event.body) : undefined,
            query: event.queryStringParameters,
            method: event.requestContext.http.method,
            headers: event.headers,
        };
        if (shouldRenderGraphiQL(request)) {
            return {
                statusCode: 302,
                headers: {
                    Location: `https://studio.apollographql.com/sandbox/explorer?endpoint=https://${event.requestContext.domainName}`,
                },
            };
        }
        const { operationName, query, variables } = getGraphQLParameters(request);
        // Validate and execute the query
        const result = await processRequest({
            operationName,
            query,
            variables,
            request,
            schema,
            formatPayload: config.formatPayload,
            contextFactory: async (execution) => {
                if (config.context) {
                    return config.context({
                        event: event,
                        context,
                        execution,
                    });
                }
                return undefined;
            },
        });
        if (result.type === "RESPONSE") {
            return {
                statusCode: result.status,
                body: JSON.stringify(result.payload),
                headers: Object.fromEntries(result.headers.map((h) => [h.name, h.value])),
            };
        }
        return {
            statusCode: 500,
        };
    };
    return handler;
}
