import React from "react";
import { useState } from "react";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./Navigator";
import { ApolloProvider } from "@apollo/client";
import client, { isLoggedInVar, loggedInUserIdVar, tokenVar } from "./apollo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [loading, setLoading] = useState(true);

  const preload = async () => {
    const token = await AsyncStorage.getItem("logintoken");
    const userId = await AsyncStorage.getItem("loggedInUserId");
    if (token) {
      isLoggedInVar(true);
      tokenVar(token);
      loggedInUserIdVar(parseInt(userId));
    }
    const fontsToLoad = [Ionicons.font];
    const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
    const imagesToLoad = [require("./assets/CoffeeLogo.png")];
    const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
    await Promise.all([fontPromises, imagePromises]);
  };
  if (loading) {
    return (
      <AppLoading
        startAsync={preload}
        onError={console.warn}
        onFinish={() => setLoading(false)}
      ></AppLoading>
    );
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </ApolloProvider>
  );
}
