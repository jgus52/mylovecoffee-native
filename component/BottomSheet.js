import React, { useEffect, useRef } from "react";
import {
  Text,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  PanResponder,
} from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { gql, useMutation } from "@apollo/client";
import client from "../apollo";
import { SEECOFFEESHOPS_QUERY } from "./CoffeeShopContent";
import { SEEMYCOFFEESHOPS_QUERY } from "./MyCoffeeShops";

export const DELETECOFFEESHOP_MUTATION = gql`
  mutation deleteCoffeeShop($coffeeShopId: Int!) {
    deleteCoffeeShop(coffeeShopId: $coffeeShopId) {
      coffeeShopId
      ok
    }
  }
`;

const Overlay = styled.View`
  background-color: rgba(0, 0, 0, 0.2);
  flex: 1;
  justify-content: flex-end;
`;

const Container = styled(Animated.View)`
  background-color: white;
  height: 300px;
  padding: 12px;
  padding-top: 30px;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
`;

const Background = styled.View`
  flex: 1;
`;

const BottomSheet = (props) => {
  const navigation = useNavigation();
  const [deleteCoffeeShop, { data: deleteResult }] = useMutation(
    DELETECOFFEESHOP_MUTATION,
    {
      update(cache, result) {
        const cachedCoffeeShops = client.readQuery({
          query: SEECOFFEESHOPS_QUERY,
        });
        const cachedMyCoffeeShops = client.readQuery({
          query: SEEMYCOFFEESHOPS_QUERY,
        });

        //console.log("cachedMyCoffeeShops", cachedMyCoffeeShops);

        const newCachedShops = {
          seeCoffeeShops: cachedCoffeeShops.seeCoffeeShops.filter(
            (ele) => ele.id !== result.data.deleteCoffeeShop.coffeeShopId
          ),
        };
        const newCachedMyShops = {
          seeMyCoffeeShops: cachedMyCoffeeShops.seeMyCoffeeShops.filter(
            (ele) => ele.id !== result.data.deleteCoffeeShop.coffeeShopId
          ),
        };

        //console.log("newCached", newCachedMyShops);

        client.writeQuery({
          query: SEECOFFEESHOPS_QUERY,
          data: newCachedShops,
        });
        client.writeQuery({
          query: SEEMYCOFFEESHOPS_QUERY,
          data: newCachedMyShops,
        });
      },
      onCompleted: () => navigation.navigate("Home"),
    }
  );

  const { modalVisible, setModalVisible, item } = props;
  const screenHeight = Dimensions.get("screen").height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: Dimensions.get("screen").height,
    duration: 500,
    useNativeDriver: true,
  });

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (event, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 0 && gestureState.vy > 1.5) {
          closeModal();
        } else {
          resetBottomSheet.start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (props.modalVisible) {
      resetBottomSheet.start();
    }
  }, [props.modalVisible]);

  const pressDelete = (coffeeShopId) => {
    //console.log(coffeeShopId);
    deleteCoffeeShop({
      variables: { coffeeShopId },
    });
    setModalVisible(false);
  };

  const closeModal = () => {
    closeBottomSheet.start(() => {
      setModalVisible(false);
    });
  };

  return (
    <Modal
      animationType="fade"
      visible={modalVisible}
      transparent
      statusBarTranslucent
    >
      <Overlay>
        <TouchableWithoutFeedback onPress={closeModal}>
          <Background />
        </TouchableWithoutFeedback>
        <Container {...panResponders.panHandlers}>
          <TouchableOpacity
            style={{ margin: 10 }}
            onPress={() => {
              //console.log(item);
              setModalVisible(false);
              navigation.navigate("Edit", { item });
            }}
          >
            <Text style={{ color: "black", fontSize: 20 }}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ margin: 10 }}
            onPress={() => {
              //console.log(item);
              pressDelete(item.id);
            }}
          >
            <Text style={{ color: "tomato", fontSize: 20 }}>Delete</Text>
          </TouchableOpacity>
        </Container>
      </Overlay>
    </Modal>
  );
};

export default BottomSheet;
