# Apollo Client 3.7.0 context issue

https://github.com/apollographql/apollo-client/issues/10166


1. run `yarn test` and see it fails.
2. change apollo client version to `3.6.10` in pacakge.json, and run `yarn test`. (it succeeds)

observe console logs.

with 3.7.0,

```
  console.log
    headerForwardLink#user-agent undefined

      at log (src/client.js:14:15)

  console.log
    headerForwardLink#cookie undefined

      at log (src/client.js:18:15)
```


with 3.6.10

```
  console.log
    headerForwardLink#user-agent user-agent-string

      at log (src/client.js:14:15)

  console.log
    headerForwardLink#cookie cookie-value

      at log (src/client.js:18:15)
```
