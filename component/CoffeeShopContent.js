import React from "react";
import styled from "styled-components/native";
import { Image, Text, TouchableOpacity, FlatList, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "../color";
import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomSheet from "./BottomSheet";
import client, { isLoggedInVar, loggedInUserIdVar, tokenVar } from "../apollo";

export const SEECOFFEESHOPS_QUERY = gql`
  query seeCoffeeShops($coffeeShopCursor: Int, $userId: Int) {
    seeCoffeeShops(coffeeShopCursor: $coffeeShopCursor, userId: $userId) {
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

const CoffeeShopContent = ({ userId = undefined }) => {
  // console.log(
  //   client.readQuery({
  //     query: SEECOFFEESHOPS_QUERY,
  //   })
  // );
  const loggedInUserId = useReactiveVar(loggedInUserIdVar);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState();
  const { loading, data, refetch, fetchMore } = useQuery(SEECOFFEESHOPS_QUERY, {
    variables: { userId: userId ? userId : undefined },
  });

  const setModal = (item) => {
    setModalVisible(true);
    setModalItem(item);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ marginBottom: 10, marginTop: 5, marginLeft: 5 }}
        onPress={() => navigation.navigate("Shop", { coffeeShopId: item.id })}
      >
        <CoffeeContainer>
          <CoffeeText>
            <ShopName>{item.name}</ShopName>
            <ShopInfo>{item.address}</ShopInfo>
            <ShopInfo>{item?.category?.name}</ShopInfo>
          </CoffeeText>
          <CoffeeImage>
            {loggedInUserId === item.userId ? (
              <CoffeeEdit>
                <TouchableOpacity
                  onPress={() => {
                    setModal(item);
                    //console.log(item);
                  }}
                >
                  <Ionicons
                    name="ellipsis-horizontal-outline"
                    size={20}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
              </CoffeeEdit>
            ) : null}
          </CoffeeImage>
        </CoffeeContainer>
        <Image
          resizeMode="cover"
          style={{ marginTop: 3, marginBottom: 3, width: 400, height: 400 }}
          source={{ uri: item?.photos[0]?.url }}
        />
        <CoffeeText>
          <ShopInfo style={{ color: "black" }}>{item.content}</ShopInfo>
        </CoffeeText>
        <BottomSheet
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          item={modalItem}
        ></BottomSheet>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <FlatList
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await refetch();
          setRefreshing(false);
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          fetchMore({
            variables: {
              userId: userId ? userId : undefined,
              coffeeShopCursor:
                data?.seeCoffeeShops[data?.seeCoffeeShops?.length - 1]?.id,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return Object.assign({}, prev, {
                seeCoffeeShops: [
                  ...prev.seeCoffeeShops,
                  ...fetchMoreResult.seeCoffeeShops,
                ],
              });
            },
          });
        }}
        showsVerticalScrollIndicator={false}
        style={{
          width: "100%",
        }}
        data={data?.seeCoffeeShops}
        renderItem={renderItem}
        keyExtractor={(coffeeShop) => "" + coffeeShop.id}
      />
    </>
  );
};

export default CoffeeShopContent;
