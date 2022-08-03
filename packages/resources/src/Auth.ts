import { Construct } from "constructs";
import { Api } from "./Api";
import { FunctionDefinition } from "./Function";

export interface AuthProps {
  /**
   * The API to attach auth routes to
   */
  api: Api;

  /**
   * The function that will handle authentication
   */
  authenticator: FunctionDefinition;

  /**
   * Optionally specify the prefix to mount authentication routes
   *
   * @default "/auth"
   */
  prefix?: string;
}

/**
 * SST Auth is a lightweight authentication solution for your applications. With a simple set of configuration you can deploy a function attached to your API that can handle various authentication flows.  *
 * @example
 * ```ts
 * import { Auth } from "@serverless-stack/resources"
 *
 * new Auth(stack, "auth", {
 *   api: myApi,
 *   function: "functions/auth.handler",
 *   prefix: "/auth" // optional
 * })
 */
export class Auth extends Construct {
  constructor(scope: Construct, id: string, props: AuthProps) {
    super(scope, id);
    const prefix = props.prefix || "/auth";

    props.api.addRoutes(scope, {
      [`ANY ${prefix}/{proxy+}`]: {
        type: "function",
        function: props.authenticator
      }
    });
  }
}
