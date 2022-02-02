import { useQuery, useReactiveVar } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import Layout from "../component/Layout";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { Image, useWindowDimensions, View } from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import { useEffect } from "react";
import { loggedInUserIdVar } from "../apollo";
import BottomSheet from "../component/BottomSheet";

const ShopContainer = styled.View`
  flex: 1;
  align-items: flex-start;
  margin: 5px;
`;
const SliderContainer = styled.View`
  height: 400px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const ShopName = styled.Text`
  font-size: 24px;
  font-weight: 700;
  margin-left: 10px;
`;
const ShopInfo = styled.Text`
  font-size: 16px;
  margin-left: 12px;
  color: rgba(0, 0, 0, 0.4);
`;
const HeaderRightIcon = styled.TouchableOpacity`
  margin-right: 8px;
`;

const SEECOFFEESHOP_QUERY = gql`
  query seeCoffeeShop($coffeeShopId: Int!) {
    seeCoffeeShop(coffeeShopId: $coffeeShopId) {
      id
      userId
      name
      address
      content
      category {
        name
      }
      photos {
        url
      }
    }
  }
`;

export default function CoffeeShop({ route, navigation }) {
  const { data } = useQuery(SEECOFFEESHOP_QUERY, {
    variables: { coffeeShopId: route?.params?.coffeeShopId },
    onCompleted: () => console.log("seeCoffeeShop"),
  });
  const [modalVisible, setModalVisible] = useState(false);
  const photos = data?.seeCoffeeShop?.photos?.map((photo) => photo?.url);
  const loggedInUserId = useReactiveVar(loggedInUserIdVar);
  //console.log(loggedInUserId);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (loggedInUserId === data?.seeCoffeeShop?.userId) {
          return (
            <HeaderRightIcon onPress={() => setModalVisible(true)}>
              <Ionicons
                name="ellipsis-horizontal-outline"
                size={20}
                style={{ marginRight: 10 }}
              />
            </HeaderRightIcon>
          );
        } else return null;
      },
    });
  }, []);

  return (
    <Layout>
      <ShopContainer>
        <ShopName style={{ color: "black" }}>
          {data?.seeCoffeeShop?.name}
        </ShopName>
        <ShopInfo>{data?.seeCoffeeShop?.address}</ShopInfo>
        <ShopInfo>{data?.seeCoffeeShop?.name}</ShopInfo>
        <SliderContainer>
          {photos ? (
            <SliderBox
              resizeMode="contain"
              sliderBoxHeight={400}
              images={photos}
            />
          ) : null}
        </SliderContainer>
        <ShopInfo style={{ color: "black" }}>
          {data?.seeCoffeeShop?.content}
        </ShopInfo>
      </ShopContainer>
      <BottomSheet
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        item={data?.seeCoffeeShop}
      ></BottomSheet>
    </Layout>
  );
}
