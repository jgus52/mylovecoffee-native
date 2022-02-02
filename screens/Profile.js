import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import Layout from "../component/Layout";
import { Color } from "../color";
import { FlatList } from "react-native-gesture-handler";
import MyCoffeeShopContent, {
  SEEMYCOFFEESHOPS_QUERY,
} from "../component/MyCoffeeShops";
import client, { loggedInUserIdVar, logUserOut } from "../apollo";
import Button, { ButtonSt } from "../component/Button";
import { useNavigation } from "@react-navigation/native";
import { SEECOFFEESHOPS_QUERY } from "../component/CoffeeShopContent";

export const SEEME_QUERY = gql`
  query seeMe {
    seeMe {
      id
      username
      name
      email
      location
      githubUsername
      totalFollowing
      totalFollower
      avatarURL
    }
  }
`;

const Container = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 50px 30px 30px 30px;
  margin-top: 20px;
  margin-bottom: 2px;
`;

const TextUername = styled.Text`
  font-size: 40px;
  font-weight: 600;
`;

const FollowContainer = styled.View`
  display: flex;
  align-items: flex-start;
`;
const Column = styled.View`
  flex-direction: row;
  align-items: center;
`;
export default function Profile({ navigation }) {
  //const loggedInUserId = useReactiveVar(loggedInUserIdVar);
  const { data, refetch: seeMeRefetch } = useQuery(SEEME_QUERY, {});
  //if (data?.userId != loggedInUserId) seeMeRefetch();

  seeMeRefetch();
  return (
    <Layout>
      <Container>
        <Column>
          <Image
            source={{ uri: data?.seeMe?.avatarURL }}
            style={{ width: 80, height: 80, borderRadius: 40, marginRight: 20 }}
          />
          <FollowContainer>
            <TextUername>{data?.seeMe?.username}</TextUername>
            <Text>{data?.seeMe?.githubUsername}</Text>
            <Text>{data?.seeMe?.location}</Text>
          </FollowContainer>
        </Column>
        <Column>
          <FollowContainer>
            <ButtonSt
              style={{ width: 70, marginBottom: 5 }}
              onPress={() =>
                navigation.navigate("EditProfile", { item: data?.seeMe })
              }
            >
              <Text>Edit</Text>
            </ButtonSt>
            <ButtonSt
              style={{ width: 70 }}
              onPress={() => {
                logUserOut();
              }}
            >
              <Text>LogOut</Text>
            </ButtonSt>
          </FollowContainer>
        </Column>
      </Container>
      <MyCoffeeShopContent userId={data?.seeMe?.id} />
    </Layout>
  );
}

//username location githubUsername //following  //follower //coffeeShops i have
