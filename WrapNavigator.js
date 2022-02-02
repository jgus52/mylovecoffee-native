import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Navigator from "./Navigator";
import Add from "./screens/Add";
import UploadNav from "./UploadNav";

const Stack = createStackNavigator();

const WrapNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        options={{ headerShown: false, presentation: "modal" }}
        component={Navigator}
      />
    </Stack.Navigator>
  );
};

export default WrapNavigator;
