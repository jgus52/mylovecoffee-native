import { TextInput } from "react-native";
import { TextInputProps } from "react-native";
import styled from "styled-components/native";

export const Input = styled.TextInput`
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  color: black;
  padding: 5px 5px;
  margin-bottom: 8px;
  border-radius: 3px;
  margin-bottom: ${(props) => (props.lastOne ? 20 : 8)}px;
`;
