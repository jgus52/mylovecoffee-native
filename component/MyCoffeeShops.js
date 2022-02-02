import React, { useEffect } from "react";
import styled from "styled-components/native";
import {
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "../color";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SEECOFFEESHOPS_QUERY } from "./CoffeeShopContent";
import client, { loggedInUserIdVar } from "../apollo";

export const SEEMYCOFFEESHOPS_QUERY = gql`
  query seeMyCoffeeShops($coffeeShopCursor: Int) {
    seeMyCoffeeShops(coffeeShopCursor: $coffeeShopCursor) {
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
`;

const CoffeeContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 2px;
  border-radius: 2px;
`;

const CoffeeText = styled.View`
  display: flex;
  justify-content: center;
`;
const CoffeeImage = styled.View`
  display: flex;
  flex-direction: row;
`;
const CoffeeEdit = styled.View`
  display: flex;
  justify-content: center;
  margin-left: 10px;
`;
const CoffeeShopName = styled.Text`
  font-size: 24px;
  color: gray;
  font-weight: 600;
`;
const ImageContainer = styled.TouchableOpacity``;

const MyCoffeeShopContent = ({ userId }) => {
  const width = Dimensions.get("screen").width;
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { data, refetch, fetchMore } = useQuery(SEEMYCOFFEESHOPS_QUERY, {});

  useEffect(() => {
    refetch();
  }, [userId]);

  const renderItem = ({ item: coffeeShop }) => {
    const imagesize = width / 3;
    return (
      <ImageContainer
        onPress={() =>
          navigation.navigate("Shop", { coffeeShopId: coffeeShop.id })
        }
      >
        <Image
          source={{ uri: coffeeShop.photos[0]?.url }}
          style={{ width: imagesize, height: imagesize }}
        ></Image>
      </ImageContainer>
    );
  };

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <FlatList
        numColumns={3}
        data={data?.seeMyCoffeeShops}
        keyExtractor={(coffeeShop) => "" + coffeeShop.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default MyCoffeeShopContent;
