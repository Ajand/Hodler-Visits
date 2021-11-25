import { ApolloClient, ApolloLink, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "apollo-link-error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "apollo-utilities";

const GRAPHQL_SERVER = process.env.REACT_APP_HTTP_GRAPHQL_URL;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("graphQLErrors", graphQLErrors);
  }
  if (networkError) {
    console.log("networkError", networkError);
  }
});

const httpLink = createUploadLink({
  uri: GRAPHQL_SERVER,
});

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_WS_ADDRESS,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem("hodler-visits-token"),
    },
    timeout: 30000
  },
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("hodler-visits-token");
  // return the headers to the context so httpLink can read them
  if (!token)
    return {
      headers: {
        ...headers,
      },
    };
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    },
  };
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: authLink.concat(ApolloLink.from([errorLink, link])),

  cache: new InMemoryCache(),
});

export default client;
