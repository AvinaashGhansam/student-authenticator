import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

const SignedInStudentPage = () => (
  <Flex height="100vh" align="center" justify="center" direction="column" p="6">
    <Image src="/public/logo.svg" height={24} width={24} />
    <Box p={8} bg="background.primary" borderRadius="md" boxShadow="lg">
      <Heading color="text.primary" mb={4} textAlign="center">
        Attend Classes
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
