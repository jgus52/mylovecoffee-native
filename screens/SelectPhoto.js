import React, { useState } from "react";
import * as MediaLibrary from "expo-media-library";
import styled from "styled-components/native";
import { useEffect } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "../color";

const Container = styled.View`
  flex: 1;
  background-color: black;
`;
const Top = styled.View`
  flex: 1;
  background-color: black;
`;
const Bottom = styled.View`
  flex: 1;
  background-color: black;
`;

const ImageContainer = styled.TouchableOpacity``;
const IconContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: 5px;
  right: 0px;
`;

const HeaderRightIcon = styled.TouchableOpacity`
  margin-right: 8px;
`;

export default function SelectPhoto({ route, navigation }) {
  const [photos, setPhotos] = useState();
  const [chosenPhoto, setChosenPhoto] = useState("");

  const getPermission = async () => {
    const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
    //console.log(status, canAskAgain);
    if ((status === "denied" || status === "undetermined") && canAskAgain) {
      const { status: request } = await MediaLibrary.requestPermissionsAsync();
      //console.log("requestPermission", request);
      if (request !== "undetermined") {
        getPhotos();
      }
    } else if (status !== "undetermined") {
      getPhotos();
    }
  };

  const getPhotos = async () => {
    const { assets: photos } = await MediaLibrary.getAssetsAsync({
      first: 20,
      sortBy: ["creationTime"],
      mediaType: ["photo"],
    });
    setPhotos(photos);
    setChosenPhoto(photos[0]?.uri);
  };

  useEffect(() => {
    getPermission();
  }, []);

  const navigate = () => {
    //console.log(chosenPhoto);
    if (route?.params?.profile) {
      navigation.navigate("EditProfile", { newAvatarURL: chosenPhoto });
    } else if (route?.params?.account) {
      navigation.navigate("CreateAccount", { newAvatarURL: chosenPhoto });
    } else navigation.navigate("Add", { photo: chosenPhoto });
  };
  const Header = () => {
    return (
      <HeaderRightIcon onPress={navigate}>
        <Ionicons name="chevron-forward" color={Color.accent} size={24} />
      </HeaderRightIcon>
    );
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: Header,
    });
  }, [chosenPhoto]);

  const { width } = useWindowDimensions();
  const choosePhoto = (uri) => {
    setChosenPhoto(uri);
  };
  const renderItem = ({ item: photo }) => (
    <ImageContainer onPress={() => choosePhoto(photo.uri)}>
      <StatusBar hidden={false} />
      <Image
        source={{ uri: photo.uri }}
        style={{ width: width / 4, height: 100 }}
      />
      <IconContainer>
        <Ionicons
          name="checkmark-circle"
          size={18}
          color={photo.uri === chosenPhoto ? Color.accent : "white"}
        />
      </IconContainer>
    </ImageContainer>
  );
  return (
    <Container>
      <Top>
        {chosenPhoto !== "" ? (
          <Image
            source={{ uri: chosenPhoto }}
            style={{ width: width, height: "100%" }}
          />
        ) : null}
      </Top>
      <Bottom>
        <FlatList
          onEndReachedThreshold={0.3}
          onEndReached={async () => {
            const { assets } = await MediaLibrary.getAssetsAsync({
              first: 20,
              createdBefore: photos[photos.length - 1].creationTime,
              sortBy: ["creationTime"],
              mediaType: ["photo"],
            });

            setPhotos(photos.concat(assets));
          }}
          data={photos}
          numColumns={4}
          keyExtractor={(photo) => photo.id}
          renderItem={renderItem}
        />
      </Bottom>
    </Container>
  );
}
