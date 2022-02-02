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
import client from "../apollo";
import { SEECOFFEESHOPS_QUERY } from "../component/CoffeeShopContent";

const EDITCOFFEESHOP_MUTATION = gql`
  mutation editCoffeeShop(
    $coffeeShopId: Int!
    $name: String
    $address: String
    $category: String
    $content: String
  ) {
    editCoffeeShop(
      coffeeShopId: $coffeeShopId
      name: $name
      address: $address
      category: $category
      content: $content
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

export default Edit = ({ navigation, route }) => {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const [editCoffeeShop, { loading, data: editResult }] = useMutation(
    EDITCOFFEESHOP_MUTATION,
    {
      update: (cache, result) => {
        const name = getValues("name");
        const address = getValues("address");
        const category = { name: getValues("category") };
        const content = getValues("content");

        const cachedShops = client.readQuery({
          query: SEECOFFEESHOPS_QUERY,
        });

        const newShops = cachedShops.seeCoffeeShops.map((ele) => {
          if (ele.id === route?.params?.item.id) {
            ele = {
              __typename: "CoffeeShop",
              id: route?.params?.item.id,
              name: name,
              address: address,
              category: category,
              content: content,
              photos: route?.params?.item.photos,
              userId: route?.params?.item.userId,
            };
          }

          return ele;
        });

        //console.log(newShops);
        client.writeQuery({
          query: SEECOFFEESHOPS_QUERY,
          data: {
            seeCoffeeShops: newShops,
          },
        });

        return;
      },
      onCompleted: () => {
        navigation.navigate("Home");
      },
    }
  );

  const onSubmit = ({ name, address, category, content }) => {
    editCoffeeShop({
      variables: {
        coffeeShopId: route?.params?.item?.id,
        name,
        address,
        category,
        content,
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
    register("name");
    register("address");
    register("category");
    register("content");

    if (!loading) {
      setValue("name", route?.params?.item?.name);
      setValue("address", route?.params?.item?.address);
      setValue("category", route?.params?.item?.category.name);
      setValue("content", route?.params?.item?.content);
    }
  }, [loading]);

  return (
    <Layout>
      <ImageContainer>
        <Photo source={{ uri: route?.params?.item?.photos[0].url }} />
      </ImageContainer>
      <Placeholder>name</Placeholder>
      <Input
        defaultValue={route?.params?.item?.name}
        onChangeText={(text) => setValue("name", text)}
      />
      <Placeholder>address</Placeholder>
      <Input
        defaultValue={route?.params?.item?.address}
        onChangeText={(text) => setValue("address", text)}
      />
      <Placeholder>category</Placeholder>
      <Input
        defaultValue={route?.params?.item?.category.name}
        onChangeText={(text) => setValue("category", text)}
      />
      <Placeholder>content</Placeholder>
      <Input
        style={{ height: 100 }}
        defaultValue={route?.params?.item?.content}
        onChangeText={(text) => setValue("content", text)}
      />
    </Layout>
  );
};
