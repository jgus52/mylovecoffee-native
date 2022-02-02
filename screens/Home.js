import React, { useEffect } from "react";
import CoffeeShopContent from "../component/CoffeeShopContent";
import Layout from "../component/Layout";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { isLoggedInVar } from "../apollo";

const HeaderRightIcon = styled.TouchableOpacity`
  margin-right: 15px;
`;

export default function Home({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (isLoggedInVar() === true) {
          return (
            <HeaderRightIcon onPress={() => navigation.navigate("Add")}>
              <Ionicons name="add-circle-outline" size={26} />
            </HeaderRightIcon>
          );
        } else return null;
      },
    });
  }, []);

  return (
    <Layout>
      <CoffeeShopContent />
    </Layout>
  );
}
