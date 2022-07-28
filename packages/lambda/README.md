## @serverless-stack/lambda

This is a collection of libraries that provide useful functionality when building Lambda functions.


### Auth

The auth library is meant to be used alongside an API Gateway to add various authentication schemes to your application. It provides a function that supports authentication with social providers, email magic link, as well as your own custom strategy.


#### Create an auth function

First you must delegate a path in your API to the auth handler in your stacks code

```ts
  const api = new Api(props.stack, "api", {
    routes: {
      "ANY /auth/{proxy+}": "functions/auth/auth.handler",
    },
  })
```

Then create a file in `functions/auth/auth.ts` to setup your auth config and handle auth request. It supports configuring various providers which are documented below.

```ts
import {
  GoogleAdapter,
  Session,
} from "@serverless-stack/lambda/auth"

export const handler = AuthHandler({
  providers: {
    google: GoogleAdapter({
      mode: "oidc",
      clientID: "<client-id>",
      onSuccess: async (tokenset) => {
        return {
          statusCode: 200,
          body: JSON.stringify(tokenset.claims())
        }
      },
    }),
  },
})
```

#### Using in your frontend

To begin authentication you can simple redirect your frontend to a url in the following format:
```
https://<domain>/auth/<provider-name>/authorize
```

#### Sessions

This library also provides a way to create and manage typesafe sessions. You can define what your various sessions and what data they contain like this:

```ts
declare module "@serverless-stack/lambda/auth" {
  export interface SessionTypes {
    user: {
      email: string
    }
  }
}
```

Then you can use one of the session strategies to generate a session in the `onSuccess` callback of your provider.

##### Parameter Strategy

This will redirect the browser to your frontend with `?token=xxx` in the query parameters. The frontend can then save it in local storage and send it up with API requests by setting an `authorization: Bearer <token>` header.

```ts
import {
  GoogleAdapter,
  Session,
} from "@serverless-stack/lambda/auth"

export const handler = AuthHandler({
  providers: {
    google: GoogleAdapter({
      mode: "oidc",
      clientID: "<client-id>",
      onSuccess: async (tokenset) => {
        return Session.parameter({
          redirect: "https://example.com",
          type: "user",
          properties: {
            email: tokenset.claims().email!,
          },
        })
      },
    }),
  },
})
```

##### Cookie Strategy
This will set a cookie on your API domain before redirecting to the specified URL. Your frontend will have to make fetch requests `credentials: "include"` so the cookie is sent up with the request. Additionally your API will need to explicitly set `allowOrigins` which is documented [here](https://docs.sst.dev/constructs/Api#alloworigins).

```ts
import {
  GoogleAdapter,
  Session,
} from "@serverless-stack/lambda/auth"

export const handler = AuthHandler({
  providers: {
    google: GoogleAdapter({
      mode: "oidc",
      clientID: "<client-id>",
      onSuccess: async (tokenset) => {
        return Session.cookie({
          redirect: "https://example.com",
          type: "user",
          properties: {
            email: tokenset.claims().email!,
          },
        })
      },
    }),
  },
})
```

##### Using the session

In any lambda function that is handling API requests, you can retreive the session with `useSession`.

```ts
import { useSession } from "@serverless-stack/lambda/auth"

function anywhere() {
  const session = useSession()
}
```

If you are not using our GraphQL handler, you need to make sure you initialize your handler using our wrapper, like so

```ts
import { useSession } from "@serverless-stack/lambda/auth"
import { Handler } from "@serverless-stack/lambda/context"

export const handler = Handler("api", async () => {
  const session = useSession()
})
```
