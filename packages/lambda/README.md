## @serverless-stack/lambda

This is a collection of libraries to help with various things when writing Lambda functions.


### Auth

The auth library is meant to be used alongside an API Gateway to add various authentication schemes to your application. It provides a function that supports authentication with social providers, email magic link, as well as your own custom strategy.


#### Setting up in your SST application

First you must delegate a path in your API to the auth handler in your stacks code

```ts
  const api = new Api(props.stack, "api", {
    routes: {
      "ANY /auth/{proxy+}": "functions/auth/auth.handler",
    },
  })
```
