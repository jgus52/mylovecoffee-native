import { useReactiveVar } from "@apollo/client";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { isLoggedInVar } from "./apollo";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import Search from "./screens/Search";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "./color";
import StackNav from "./StackNav";
import { createStackNavigator } from "@react-navigation/stack";
import UploadNav from "./UploadNav";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Navigator = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: "",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Color.bgColor,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: Color.accent,
      }}
    >
      <Tab.Screen
        name="Home_Tab"
        options={{
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name="home" size={24} color={color} />
            ) : (
              <Ionicons name="home-outline" size={24} color={color} />
            ),
        }}
      >
        {() => <StackNav screenName="Home" />}
      </Tab.Screen>
      <Tab.Screen
        name="Search_Tab"
        options={{
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name="search" size={24} color={color} />
            ) : (
              <Ionicons name="search-outline" size={24} color={color} />
            ),
        }}
      >
        {() => <StackNav screenName="Search" />}
      </Tab.Screen>
      {isLoggedIn ? (
        <Tab.Screen
          name="Profile_Tab"
          options={{
            tabBarIcon: ({ focused, color }) =>
              focused ? (
                <Ionicons name="person" size={24} color={color} />
              ) : (
                <Ionicons name="person-outline" size={24} color={color} />
              ),
          }}
        >
          {() => <StackNav screenName="Profile" />}
        </Tab.Screen>
      ) : (
        <Tab.Screen
          name="Login_Tab"
          options={{
            tabBarIcon: ({ focused, color }) =>
              focused ? (
                <Ionicons name="person" size={24} color={color} />
              ) : (
                <Ionicons name="person-outline" size={24} color={color} />
              ),
          }}
        >
          {() => <StackNav screenName="Login" />}
        </Tab.Screen>
      )}
    </Tab.Navigator>
  );
};

export default Navigator;
