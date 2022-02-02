import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/client/link/error";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");
export const loggedInUserIdVar = makeVar(-1);

export const logUserIn = async (token, userId) => {
  await AsyncStorage.setItem("logintoken", token);
  await AsyncStorage.setItem("loggedInUserId", String(userId));
  isLoggedInVar(true);
  tokenVar(token);
  loggedInUserIdVar(userId);
};

export const logUserOut = async () => {
  await AsyncStorage.removeItem("logintoken");
  isLoggedInVar(false);
  tokenVar("");
  loggedInUserIdVar(-1);
};

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) console.log("graphQLErrors", graphQLErrors);
  if (networkError) console.log("network error", networkError);
});
const httpLink = createUploadLink({
  uri: "https://mylovecoffee-backend.herokuapp.com/graphql",
  //uri: "http://192.168.219.159:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      logintoken: tokenVar(),
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(onErrorLink).concat(httpLink),
  cache: new InMemoryCache({
    freezeResults: true,
    // typePolicies: {
    //   Query: {
    //     fields: {
    //       seeCoffeeShops: {
    //         read(existing) {
    //           if (existing) {
    //             return existing;
    //           }
    //         },
    //         merge(existing, incoming) {
    //           const merged = existing ? existing.slice(0) : [];
    //           let offset = merged.length;
    //           for (let i = 0; i < incoming.length; ++i) {
    //             merged[offset + i] = incoming[i];
    //           }
    //           return merged;
    //         },
    //       },
    //     },
    //   },
    // },
  }),
  assumeImmutableResults: true,
});

export default client;
