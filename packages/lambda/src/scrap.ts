import { GraphQLSchema } from "graphql";
import { AuthHandler } from "./auth/auth.js";
import { GraphQLHandler } from "./index.js";

export const handler = GraphQLHandler({
  schema: new GraphQLSchema({})
});

export const auth = AuthHandler();
