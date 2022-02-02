import { Text } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Camera } from "expo-camera";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

const Container = styled.View`
  flex: 1;
  background-color: black;
`;
const Photo = styled.Image`
  flex: 1;
`;
const SliderContainer = styled.View`
  flex: 0.1;
  width: 100%;
  position: absolute;
  top: 20px;
`;
const Buttons = styled.View`
  flex: 0.3;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const Action = styled.View`
  position: absolute;
  bottom: 70px;
  right: 20px;
  align-items: center;
  flex-direction: row;
`;
const ActionButton = styled.TouchableOpacity`
  margin-left: 5px;
`;
const Button = styled.TouchableOpacity``;
const Press = styled.View`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  background-color: rgba(255, 255, 255, 0.7);
  border: 0.5px solid rgba(255, 255, 255, 0.3);
`;
const Uploads = styled.View`
  flex: 0.3;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;
const Upload = styled.Text`
  color: white;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.7);
`;

export default function TakePhoto({ navigation }) {
  const camera = useRef();
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [zoom, setZoom] = useState(0);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [cameraReady, setCameraReady] = useState(false);
  const [permission, setPermission] = useState(false);
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status === "granted");
    })();
  }, []);

  const switchCameraType = () => {
    {
      if (cameraType === Camera.Constants.Type.front) {
        setCameraType(Camera.Constants.Type.back);
      } else setCameraType(Camera.Constants.Type.front);
    }
  };
  const switchFlashMode = () => {
    if (flashMode === Camera.Constants.FlashMode.off) {
      setFlashMode(Camera.Constants.FlashMode.on);
    } else if (flashMode === Camera.Constants.FlashMode.on) {
      setFlashMode(Camera.Constants.FlashMode.auto);
    } else if (flashMode === Camera.Constants.FlashMode.auto) {
      setFlashMode(Camera.Constants.FlashMode.off);
    }
  };
  const onCameraReady = () => setCameraReady(true);
  const takePhoto = async () => {
    if (cameraReady && camera.current) {
      const photo = await camera.current.takePictureAsync({
        quality: 1,
        exif: true,
        skipProcessing: true,
      });
      setPhoto(photo.uri);
    }
  };
  const setZoomValue = (e) => {
    setZoom(e);
  };

  return (
    <Container>
      {photo === "" ? (
        <Camera
          type={cameraType}
          style={{ flex: 1 }}
          zoom={zoom}
          flashMode={flashMode}
          ref={camera}
          onCameraReady={onCameraReady}
        ></Camera>
      ) : (
        <Photo source={{ uri: photo }} />
      )}
      {photo === "" ? (
        <Buttons>
          <SliderContainer>
            <Slider
              style={{ width: "100%", height: 20 }}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
              thumbTintColor="lightgray"
              onValueChange={setZoomValue}
            />
          </SliderContainer>
          <Button onPress={takePhoto}>
            <Press />
          </Button>
          <Action>
            <ActionButton onPress={switchCameraType}>
              <Ionicons name="camera-reverse-outline" color="white" size={25} />
            </ActionButton>
            <ActionButton onPress={switchFlashMode}>
              <Ionicons
                size={30}
                color="white"
                name={
                  flashMode === Camera.Constants.FlashMode.off
                    ? "flash-off"
                    : flashMode === Camera.Constants.FlashMode.on
                    ? "flash"
                    : flashMode === Camera.Constants.FlashMode.auto
                    ? "eye"
                    : ""
                }
              />
            </ActionButton>
          </Action>
        </Buttons>
      ) : (
        <Uploads>
          <Button onPress={() => navigation.navigate("Add", { photo })}>
            <Upload>Upload</Upload>
          </Button>
          <Button onPress={() => setPhoto("")}>
            <Upload>Take more!</Upload>
          </Button>
        </Uploads>
      )}
    </Container>
  );
}
