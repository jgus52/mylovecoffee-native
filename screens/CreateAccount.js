import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";
import { Input } from "../component/TextInput";
import { Ionicons } from "@expo/vector-icons";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { ActivityIndicator } from "react-native";
import { Color } from "../color";
import { ReactNativeFile } from "apollo-upload-client";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import client from "../apollo";

const CREATEACCOUNT_MUTATION = gql`
  mutation createAccount(
    $username: String!
    $email: String!
    $name: String!
    $location: String!
    $password: String!
    $avatarURL: Upload
    $githubUsername: String!
  ) {
    createAccount(
      username: $username
      email: $email
      name: $name
      location: $location
      password: $password
      avatarURL: $avatarURL
      githubUsername: $githubUsername
    ) {
      ok
      error
    }
  }
`;

const Layout = styled.View`
  flex: 1;
  padding: 20px;
`;
const ImageContainer = styled.TouchableOpacity`
  align-items: center;
`;
const ChangeImage = styled.Text`
  margin-top: 3px;
  color: ${Color.accent};
`;
const Photo = styled.Image`
  width: 100px;
  height: 100px;
`;
const Placeholder = styled.Text`
  color: rgba(0, 0, 0, 0.7);
  margin-top: 10px;
  margin-bottom: 2px;
`;
const HeaderRightIcon = styled.TouchableOpacity`
  margin-right: 8px;
`;

export default CreateAccount = ({ navigation, route }) => {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const [createAccount, { loading }] = useMutation(CREATEACCOUNT_MUTATION, {
    onCompleted: () => navigation.navigate("Login"),
  });

  const onSubmit = ({
    username,
    email,
    name,
    location,
    password,
    avatarURL,
    githubUsername,
  }) => {
    let upload = null;

    if (avatarURL) {
      upload = new ReactNativeFile({
        uri: avatarURL,
        name: `1.jpg`,
        type: "image/jpeg",
      });
    }

    createAccount({
      variables: {
        username,
        email,
        name,
        location,
        password,
        avatarURL: upload,
        githubUsername,
      },
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        loading ? (
          <ActivityIndicator color={Color.accent} style={{ marginRight: 8 }} />
        ) : (
          <HeaderRightIcon onPress={handleSubmit(onSubmit)} enabled={!loading}>
            <Ionicons name="chevron-forward" color={Color.accent} size={20} />
          </HeaderRightIcon>
        ),
    });
    register("username");
    register("email");
    register("location");
    register("name");
    register("avatarURL");
    register("githubUsername");
    register("password");

    setValue("avatarURL", route?.params?.newAvatarURL);
  }, [loading, route]);

  return (
    <KeyboardAwareScrollView>
      <Layout>
        <ImageContainer
          onPress={() =>
            navigation.navigate("Upload", {
              account: true,
            })
          }
        >
          <Photo source={{ uri: route?.params?.newAvatarURL }} />
          <ChangeImage>Change Image</ChangeImage>
        </ImageContainer>
        <Placeholder>username</Placeholder>
        <Input
          defaultValue={route?.params?.username}
          onChangeText={(text) => setValue("username", text)}
        />
        <Placeholder>password</Placeholder>
        <Input
          defaultValue={route?.params?.password}
          secureTextEntry
          onChangeText={(text) => setValue("password", text)}
        />

        <Placeholder>name</Placeholder>
        <Input
          defaultValue={route?.params?.name}
          onChangeText={(text) => setValue("name", text)}
        />
        <Placeholder>location</Placeholder>
        <Input
          defaultValue={route?.params?.location}
          onChangeText={(text) => setValue("location", text)}
        />
        <Placeholder>email</Placeholder>
        <Input
          defaultValue={route?.params?.email}
          onChangeText={(text) => setValue("email", text)}
        />
        <Placeholder>githubUsername</Placeholder>
        <Input
          defaultValue={route?.params?.githubUsername}
          onChangeText={(text) => setValue("githubUsername", text)}
        />
      </Layout>
    </KeyboardAwareScrollView>
  );
};
