import { Flex, Heading, Image } from "@chakra-ui/react";
import CustomButton from "../ui/CustomButton";
import React from "react";

interface HeaderProps {
  user?: any;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut }) => {
  const firstName = user?.unsafeMetadata?.firstName ?? "";
  const lastName = user?.unsafeMetadata?.lastName ?? "";
  return (
    <Flex
      as="header"
      width="100%"
      align="center"
      justify="space-between"
      mb="4"
      position="relative"
      minH="64px"
    >
      <Flex align="center" gap={3}>
        <Image src="/logo.svg" alt="Logo" boxSize="40px" />
        <Heading fontWeight="bold" color="primary.900" fontSize="lg">
          Welcome, Professor{" "}
          {firstName.charAt(0).toUpperCase() + firstName.slice(1)}{" "}
          {lastName.charAt(0).toUpperCase() + lastName.slice(1)}!
        </Heading>
      </Flex>
      <CustomButton
        onClick={onSignOut}
        title="Sign Out"
        bg="warning.900"
        _hover={{ bg: "warning.850" }}
        size="sm"
        position="absolute"
        top="0"
        right="0"
        mt={2}
        mr={2}
      />
    </Flex>
  );
};

export default Header;
