import { Box, Flex, Heading, Text } from "@chakra-ui/react";

const SignedInStudentPage = () => (
  <Flex height="100vh" align="center" justify="center" direction="column" p="6">
    <Box p={8} bg="background.primary" borderRadius="md" boxShadow="lg">
      <Heading color="text.primary" mb={4} textAlign="center">
        You are signed in
      </Heading>
      <Text color="text.secondary" fontSize="lg" textAlign="center">
        The attendance sheet is currently closed or inactive.
        <br />
        Please wait for your professor to open a new sheet.
      </Text>
    </Box>
  </Flex>
);

export default SignedInStudentPage;
