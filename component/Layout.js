import React from "react";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  padding: ${(props) => (props.padding ? props.padding : 0)}px;
`;

const Layout = ({ children, padding }) => {
  return <Container padding={padding}>{children}</Container>;
};

export default Layout;
