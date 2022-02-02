import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SelectPhoto from "./screens/SelectPhoto";
import TakePhoto from "./screens/TakePhoto";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "./color";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

export default function UploadNav({ route }) {
  return (
    <Tab.Navigator tabBarPosition="bottom">
      <Tab.Screen name="Select">
        {() => (
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: "black", shadowOpacity: 0.3 },
              headerTintColor: "white",
              headerBackTitleVisible: false,
              headerBackImage: ({ tintColor }) => (
                <Ionicons color={tintColor} name="close" size={24} />
              ),
            }}
          >
            <Stack.Screen
              name="Select_Stack"
              options={{
                headerTitle: "Choose a Photo",
                headerTitleAlign: "center",
              }}
              component={SelectPhoto}
              initialParams={{
                profile: route?.params?.profile,
                account: route?.params?.account,
              }}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen name="Take" component={TakePhoto} />
    </Tab.Navigator>
  );
}
