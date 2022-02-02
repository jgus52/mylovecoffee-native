import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home";
import Search from "./screens/Search";
import CoffeeShop from "./screens/CoffeeShop";
import Add from "./screens/Add";
import UploadNav from "./UploadNav";
import Edit from "./screens/Edit";
import EditProfile from "./screens/EditProfile";
import Profile from "./screens/Profile";
import Login from "./screens/Login";
import CreateAccount from "./screens/CreateAccount";

const Stack = createStackNavigator();

const StackNav = ({ screenName }) => {
  return (
    <Stack.Navigator>
      {screenName === "Home" ? (
        <Stack.Screen name="Home" component={Home} />
      ) : null}
      {screenName === "Search" ? (
        <Stack.Screen name="Search" component={Search} />
      ) : null}
      {screenName === "Profile" ? (
        <Stack.Screen
          options={{ headerShown: false, presentation: "modal" }}
          name="Profile"
          component={Profile}
        />
      ) : null}
      {screenName === "Login" ? (
        <Stack.Screen name="Login" component={Login} />
      ) : null}
      <Stack.Screen name="Shop" component={CoffeeShop} />
      <Stack.Screen name="Add" component={Add} />
      <Stack.Screen
        name="Upload"
        options={{ headerShown: false, presentation: "modal" }}
        component={UploadNav}
      />
      <Stack.Screen name="Edit" component={Edit} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
    </Stack.Navigator>
  );
};

export default StackNav;
