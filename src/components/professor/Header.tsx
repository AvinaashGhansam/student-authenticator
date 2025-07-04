import { Flex, Heading } from "@chakra-ui/react";
import CustomButton from "../ui/CustomButton";

interface HeaderProps {
  user?: any;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut }) => (
  <Flex as="header" width="100%" align="center" justify="space-between" mb="4">
    <Heading fontWeight="bold" color="primary.900">
      Welcome, Professor
      {" " + user?.unsafeMetadata.firstName + user?.unsafeMetadata.lastName}!
    </Heading>
    <CustomButton
      onClick={onSignOut}
      title="Sign Out"
      bg="warning.900"
      _hover={{ bg: "warning.850" }}
      display={{ base: "none", md: "inline-flex" }}
    />
  </Flex>
);

export default Header;
