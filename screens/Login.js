import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import Layout from "../component/Layout";
import { Input } from "../component/TextInput";
import { logUserIn } from "../apollo";
import Button, { ButtonSt } from "../component/Button";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { Text } from "react-native";
import { Color } from "../color";
import { SEEME_QUERY } from "./Profile";
import { SEEMYCOFFEESHOPS_QUERY } from "../component/MyCoffeeShops";

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
      userId
      user {
        username
        email
        location
        name
        avatarURL
        githubUsername
      }
    }
  }
`;

export default function Login({ navigation, route }) {
  const { register, handleSubmit, setValue, watch, getValues } = useForm({});

  useEffect(() => {
    register("username");
    register("password");
  }, [register]);

  const [login, { loading, data }] = useMutation(LOGIN_MUTATION, {
    onCompleted: async (data) => {
      if (data?.login?.ok) {
        await logUserIn(data?.login?.token, data?.login?.userId);
      }
    },
  });
  const onValid = () => {
    const { username, password } = getValues();

    if (!loading) {
      login({
        variables: { username, password },
      });
    }
  };

  const passwordRef = useRef();

  return (
    <Layout padding={10}>
      <Input
        value={watch("username")}
        placeholder="username"
        autoCapitalize={"none"}
        placeholderTextColor="gray"
        onSubmitEditing={() => passwordRef?.current?.focus()}
        onChangeText={(text) => setValue("username", text)}
      />
      <Input
        ref={passwordRef}
        placeholder="password"
        secureTextEntry
        returnKeyType="done"
        placeholderTextColor="gray"
        lastOne
        onChangeText={(text) => setValue("password", text)}
      />
      <Button
        content="Login"
        loading={loading}
        disabled={!watch("username") || !watch("password")}
        onPress={handleSubmit(onValid)}
      />
      <ButtonSt
        onPress={handleSubmit(() => navigation.navigate("CreateAccount"))}
        style={{
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: Color.accent,
          marginTop: 5,
        }}
      >
        <Text style={{ alignSelf: "stretch", textAlign: "center" }}>
          Create Account
        </Text>
      </ButtonSt>
    </Layout>
  );
}
