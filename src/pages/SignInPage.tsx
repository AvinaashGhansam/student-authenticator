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
import studentImg from "../assets/student.jpeg";

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
    <Flex minH="100vh" align="center" justify="center" position="relative" bg="gray.50">
      {/* Background Image */}
      <Image
        src={studentImg}
        alt="Student"
        objectFit="contain"
        opacity={0.3}
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        zIndex={0}
      />
      {/* Centered Form Popup */}
      <Container
        maxW="md"
        p={8}
        bg="whiteAlpha.900"
        borderRadius="2xl"
        boxShadow="2xl"
        zIndex={1}
        position="relative"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Heading size="lg" color="primary.900" mb={6} textAlign="center">
          Instructor Sign In
        </Heading>
        <form
          style={{ width: "100%" }}
          onSubmit={e => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <Field.Root mb={4}>
            <Field.Label>Email</Field.Label>
            <Input
              placeholder="Enter your .edu email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              required
            />
          </Field.Root>
          <Field.Root mb={6}>
            <Field.Label>Password</Field.Label>
            <Input
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              required
            />
          </Field.Root>
          <CustomButton
            title="Sign In"
            type="submit"
          />
        </form>
        <Text mt={6} color="gray.600" fontSize="sm" textAlign="center">
          Only instructors can sign in here. Students should use the attendance link provided by their professor.
        </Text>
      </Container>
    </Flex>
  );
};

export default SignInPage;
