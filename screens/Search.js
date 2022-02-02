import { gql, useLazyQuery, useQuery } from "@apollo/client";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, View, useWindowDimensions, ImageBackground } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import styled from "styled-components/native";

const SEARCHCOFFEESHOP_QUERY = gql`
  query searchCoffeeShop($search: String!) {
    searchCoffeeShop(search: $search) {
      id
      name
      address
      category {
        name
      }
      photos {
        url
      }
    }
  }
`;

const ImageContainer = styled.TouchableOpacity``;

const SearchBar = styled.TextInput`
  width: ${(props) => props.width * 0.7}px;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 5px 10px;
  border-radius: 3px;
`;
const Name = styled.Text`
  font-weight: 600;
`;

export default function Search({ navigation }) {
  const { width } = useWindowDimensions();
  const { register, handleSubmit, setValue } = useForm();
  const [searchCoffeeShop, { data, loading, called }] = useLazyQuery(
    SEARCHCOFFEESHOP_QUERY
  );
  const onValid = ({ search }) => {
    searchCoffeeShop({
      variables: { search },
    });
  };

  useEffect(() => {
    register("search");
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => {
        return (
          <SearchBar
            onChangeText={(text) => setValue("search", text)}
            onSubmitEditing={handleSubmit(onValid)}
            width={width}
            placeholder="Search with category or name..."
          />
        );
      },
      headerTitleAlign: "center",
    });
  }, []);

  const renderItem = ({ item: coffeeShop }) => {
    const imagesize = width / 3;
    return (
      <ImageContainer
        onPress={() =>
          navigation.navigate("Shop", { coffeeShopId: coffeeShop.id })
        }
      >
        <ImageBackground
          source={{ uri: coffeeShop.photos[0]?.url }}
          style={{ width: imagesize, height: imagesize }}
        ></ImageBackground>
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
      {!called ? (
        <View
          style={{
            width: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Search with shop name or Category</Text>
        </View>
      ) : null}
      {loading ? (
        <View
          style={{
            width: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>loading</Text>
        </View>
      ) : null}
      {data?.searchCoffeeShop !== undefined ? (
        data?.searchCoffeeShop.length === 0 ? (
          <View
            style={{
              width: "100%",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>Nothing searched!</Text>
          </View>
        ) : (
          <FlatList
            numColumns={4}
            data={data?.searchCoffeeShop}
            keyExtractor={(coffeeShop) => "" + coffeeShop.id}
            renderItem={renderItem}
          />
        )
      ) : null}
    </View>
  );
}
