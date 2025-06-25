import {
  Container,
  Field,
  Flex,
  Heading,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/ui/CustomButton.tsx";
import { toaster } from "../components/ui/toaster.tsx";

const SignInPage = () => {
  const { signIn, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      if (!password || !email || !password.length) {
        return;
      }

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        console.log("Sign in successful", result);
        toaster.create({
          title: "Signed in successfully",
          type: "success",
          description: "Welcome back!",
        });
        navigate("/professor-dashboard");
      } else {
        console.log("Sign in not complete", result);
      }
    } catch (err) {
      console.error("Sign in failed", err);
      toaster.create({
        title: "Signed in failed",
        type: "error",
        description: "Invalid credentials!",
      });
    }
  };

  return (
    <Flex height="100vh" bg="background.primary">
      <Flex flex="1" align="center" justify="center" p="8" direction="column">
        <Image
          src="src/assets/student.jpeg"
          alt="Image of Students"
          borderRadius="md"
          height="500px"
          width="600px"
        />
      </Flex>
      <Flex
        flex="1"
        align="center"
        justify="center"
        p="8"
        boxShadow="lg"
        direction="column"
      >
        <Heading mb="10" fontSize="5xl" color="primary.900" fontWeight="bold">
          Attendance
        </Heading>
        <Container maxW="md">
          <Field.Root mb={4}>
            <Field.Label>Email</Field.Label>
            <Input
              placeholder="me@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field.Root>

          <Field.Root mb={6}>
            <Field.Label>Password</Field.Label>
            <Input
              placeholder="••••••••"
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field.Root>

          <CustomButton title="Sign In" onClick={handleSignIn} />

          <Text
            fontWeight="light"
            color="text.secondary"
            mt={2}
            fontStyle="italic"
          >
            Don’t have an account?{" "}
            <CustomButton
              title="Sign Up"
              bg="background.primary"
              color="primary.900"
              onClick={() => navigate("/signup")}
            />
          </Text>
        </Container>
      </Flex>
    </Flex>
  );
};

export default SignInPage;
