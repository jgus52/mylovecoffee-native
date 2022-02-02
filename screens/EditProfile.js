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
import { SEEME_QUERY } from "./Profile";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const EDITPROFILE_MUTATION = gql`
  mutation editProfile(
    $username: String
    $email: String
    $location: String
    $name: String
    $avatarURL: Upload
    $githubUsername: String
    $password: String
  ) {
    editProfile(
      username: $username
      email: $email
      location: $location
      name: $name
      avatarURL: $avatarURL
      githubUsername: $githubUsername
      password: $password
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

export default EditProfile = ({ navigation, route }) => {
  //console.log(route?.params?.newAvatarURL);
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const [editProfile, { loading }] = useMutation(EDITPROFILE_MUTATION, {
    onCompleted: () => navigation.navigate("Profile"),
    refetchQueries: [SEEME_QUERY],
  });

  setValue("avatarURL", route?.params?.newAvatarURL);
  const onSubmit = ({
    username,
    email,
    location,
    name,
    githubUsername,
    avatarURL,
    password,
  }) => {
    let upload = null;
    //console.log(avatarURL);
    if (avatarURL) {
      upload = new ReactNativeFile({
        uri: avatarURL,
        name: `1.jpg`,
        type: "image/jpeg",
      });
    }

    editProfile({
      variables: {
        username,
        email,
        location,
        name,
        avatarURL: upload,
        githubUsername,
        password,
      },
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        loading ? (
          <ActivityIndicator color={Color.accent} style={{ marginRight: 8 }} />
        ) : (
          <HeaderRightIcon onPress={handleSubmit(onSubmit)}>
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

    if (!loading) {
      setValue("username", route?.params?.item?.username);
      setValue("email", route?.params?.item?.email);
      setValue("location", route?.params?.item?.location);
      setValue("name", route?.params?.item?.name);
      setValue("githubUsername", route?.params?.item?.githubUsername);
    }
  }, [loading]);

  return (
    <KeyboardAwareScrollView>
      <Layout>
        <ImageContainer
          onPress={() =>
            navigation.navigate("Upload", {
              profile: true,
            })
          }
        >
          <Photo
            source={{
              uri: route?.params?.newAvatarURL
                ? route?.params?.newAvatarURL
                : route?.params?.item.avatarURL,
            }}
          />
          <ChangeImage>Change Image</ChangeImage>
        </ImageContainer>
        <Placeholder>username</Placeholder>
        <Input
          defaultValue={watch("username")}
          onChangeText={(text) => setValue("username", text)}
        />
        <Placeholder>email</Placeholder>
        <Input
          defaultValue={watch("email")}
          onChangeText={(text) => setValue("email", text)}
        />
        <Placeholder>location</Placeholder>
        <Input
          defaultValue={watch("location")}
          onChangeText={(text) => setValue("location", text)}
        />
        <Placeholder>name</Placeholder>
        <Input
          defaultValue={watch("name")}
          onChangeText={(text) => setValue("name", text)}
        />
        <Placeholder>githubUsername</Placeholder>
        <Input
          defaultValue={watch("githubUsername")}
          onChangeText={(text) => setValue("githubUsername", text)}
        />
        <Placeholder>password</Placeholder>
        <Input onChangeText={(text) => setValue("password", text)} />
      </Layout>
    </KeyboardAwareScrollView>
  );
};
