const {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache
} = require("@apollo/client/core");
const fetch = require("cross-fetch");

const headerForwardLink = () => {
  const link = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers }) => {
      const serverRequest = operation.getContext().serverRequest;

      console.log(
        "headerForwardLink#user-agent",
        serverRequest.headers["user-agent"]
      );
      console.log("headerForwardLink#cookie", serverRequest.headers.cookie);
      return {
        headers: {
          ...headers,
          "user-agent": serverRequest.headers["user-agent"],
          cookie: serverRequest.headers.cookie
        }
      };
    });

    return forward(operation).map((result) => {
      const response = operation.getContext().response;

      let setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        const serverResponse = operation.getContext().serverResponse;
        serverResponse.setHeader("set-cookie", setCookieHeader);
      }
      return result;
    });
  });

  return link;
};

module.exports.createClient = (endpoint) => {
  const httpLink = new HttpLink({
    uri: endpoint,
    credentials: "include",
    fetch
  });

  const client = new ApolloClient({
    link: ApolloLink.from([headerForwardLink(), httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "all"
      },
      query: {
        fetchPolicy: "no-cache"
      },
      mutate: {
        fetchPolicy: "no-cache",
        errorPolicy: "all"
      }
    }
  });

  return client;
};
