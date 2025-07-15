import { Flex, Spinner, Text } from "@chakra-ui/react";
import React from "react";

const LoadingSheet: React.FC = () => (
  <Flex
    height="100vh"
    align="center"
    justify="center"
    direction="column"
    p="6"
    bgGradient="linear(to-br, background.primary 60%, primary.100 100%)"
  >
    <Spinner size="xl" />
    <Text mt="4" color="gray.600">
      Loading sheet...
    </Text>
  </Flex>
);

export default LoadingSheet;
