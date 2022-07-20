import { GraphQLSchema } from "graphql";
import { GraphQLHandler } from "./index.js";

export const handler = GraphQLHandler({
  schema: new GraphQLSchema({})
});
