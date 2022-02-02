import styled from "styled-components/native";
import { Color } from "../color";
import React from "react";
import { ActivityIndicator, TouchableOpacityProps } from "react-native";

export const ButtonSt = styled.TouchableOpacity`
  background-color: ${Color.accent};
  padding: 8px 10px;
  border-radius: 5px;
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.3" : "1")};
`;

const ButtonContent = styled.Text`
  color: black;
  font-weight: 600;
  text-align: center;
`;
const Button = ({ content, disabled, onPress, loading }) => {
  return (
    <ButtonSt disabled={disabled} onPress={onPress}>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <ButtonContent>{content}</ButtonContent>
      )}
    </ButtonSt>
  );
};

export default Button;
