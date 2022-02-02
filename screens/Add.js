import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";
import { Input } from "../component/TextInput";
import { Ionicons } from "@expo/vector-icons";
import gql from "graphql-tag";
import { useMutation, useReactiveVar } from "@apollo/client";
import { ActivityIndicator } from "react-native";
import { Color } from "../color";
import { ReactNativeFile } from "apollo-upload-client";
import client, { loggedInUserIdVar } from "../apollo";
import { SEEMYCOFFEESHOPS_QUERY } from "../component/MyCoffeeShops";
import { SEECOFFEESHOPS_QUERY } from "../component/CoffeeShopContent";

const CREATECOFFEESHOP_MUTATION = gql`
  mutation createCoffeeShop(
    $name: String!
    $address: String!
    $category: String
    $photos: [Upload]
    $content: String
  ) {
    createCoffeeShop(
      name: $name
      address: $address
      category: $category
      photos: $photos
      content: $content
    ) {
      ok
      error
      coffeeShop {
        id
        userId
        name
        address
        content
        category {
          name
        }
        photos {
          id
          url
        }
      }
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

export default function Add({ route, navigation }) {
  //console.log(route);
  const loggedInUserId = useReactiveVar(loggedInUserIdVar);
  const { register, handleSubmit, setValue, getValues } = useForm();
  const [createCoffeeShop, { data, loading }] = useMutation(
    CREATECOFFEESHOP_MUTATION,
    {
      update: (cache, result) => {
        const {
          data: { createCoffeeShop },
        } = result;

        let cachedCoffeeShops = client.readQuery({
          query: SEECOFFEESHOPS_QUERY,
        });
        let cachedMyCoffeeShops = client.readQuery({
          query: SEEMYCOFFEESHOPS_QUERY,
        });

        client.writeQuery({
          query: SEECOFFEESHOPS_QUERY,
          data: {
            seeCoffeeShops: [
              ...[createCoffeeShop.coffeeShop],
              ...cachedCoffeeShops.seeCoffeeShops,
            ],
          },
        });
        client.writeQuery({
          query: SEEMYCOFFEESHOPS_QUERY,
          data: {
            seeMyCoffeeShops: [
              ...[createCoffeeShop.coffeeShop],
              ...cachedMyCoffeeShops.seeMyCoffeeShops,
            ],
          },
        });
        return;
      },
      onCompleted: () => {
        navigation.navigate("Home");
      },
    }
  );

  const onSubmit = ({ name, address, category, photo, content }) => {
    let photos;

    if (photo) {
      const upload = new ReactNativeFile({
        uri: photo,
        name: `1.jpg`,
        type: "image/jpeg",
      });

      photos = upload;
    }

    createCoffeeShop({
      variables: { name, address, category, photos, content },
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
    register("name");
    register("address");
    register("category");
    register("photo");
    register("content");
  }, [loading]);

  setValue("photo", route?.params?.photo);

  return (
    <Layout>
      <ImageContainer onPress={() => navigation.navigate("Upload")}>
        <Photo source={{ uri: route?.params?.photo }} />
        <ChangeImage>Change Image</ChangeImage>
      </ImageContainer>
      <Placeholder>name</Placeholder>
      <Input
        defaultValue={route?.params?.name}
        onChangeText={(text) => setValue("name", text)}
      />
      <Placeholder>address</Placeholder>
      <Input
        defaultValue={route?.params?.address}
        onChangeText={(text) => setValue("address", text)}
      />
      <Placeholder>category</Placeholder>
      <Input
        defaultValue={route?.params?.category}
        onChangeText={(text) => setValue("category", text)}
      />
      <Placeholder>content</Placeholder>
      <Input
        style={{ height: 100 }}
        defaultValue={route?.params?.content}
        onChangeText={(text) => setValue("content", text)}
      />
    </Layout>
  );
}
