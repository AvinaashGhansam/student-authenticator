import {
  Button,
  Container,
  Field,
  Flex,
  Heading,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";

const SignInPage = () => {
  // TODO: The way the image is pulled in is not correct
  return (
    <Flex height="100vh" bg="background.primary">
      <Flex flex="1" align="center" justify="center" p="8" direction="column">
        <Heading mb="4" fontSize="5xl" color="primary.900" fontWeight="bold">
          Attendance
        </Heading>
        <Image
          src="src/assets/student.jpeg"
          alt="Image of Students"
          borderRadius="md"
          height="500px"
          width="600px"
        />
      </Flex>
      <Flex flex="1" align="center" justify="center" p="8" boxShadow="lg">
        <Container maxW="md">
          <Field.Root mb={4}>
            <Field.Label>Email</Field.Label>
            <Input placeholder="me@example.com" />
          </Field.Root>

          <Field.Root mb={6}>
            <Field.Label>Password</Field.Label>
            <Input placeholder="••••••••" type="password" />
          </Field.Root>
          <Button bg="primary.900" fontWeight="bold">
            Sign In
          </Button>
          <Text
            fontWeight="light"
            color="text.secondary"
            mt={2}
            fontStyle="italic"
          >
            Please get with your administrator to set an account up
          </Text>
        </Container>
      </Flex>
    </Flex>
  );
};
export default SignInPage;
