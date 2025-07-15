import {
  Container,
  Field,
  Flex,
  Heading,
  Image,
  Input,
  Text,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSignIn, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/ui/CustomButton.tsx";
import { toaster } from "../components/ui/toaster.tsx";
import logo from "../../public/logo.svg";
import CustomModal from "../components/ui/CustomModal";

const SignInPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { signOut, isSignedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState<
    null | "success" | "error" | "pending"
  >(null);
  const [forgotStep, setForgotStep] = useState<"email" | "code" | "success">(
    "email",
  );
  const [forgotCode, setForgotCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyNewPassword, setVerifyNewPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/professor-dashboard", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleSignIn = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      if (!password || !email || !password.length) {
        return;
      }

      // Always sign out before attempting a new sign in to ensure session is reset everywhere
      if (signOut) {
        await signOut();
      }

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive?.({ session: result.createdSessionId });
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

  const handleForgotSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setForgotStatus("pending");
    setForgotError("");
    if (!forgotEmail) {
      setForgotStatus(null);
      setForgotError("Email is required.");
      return;
    }
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: forgotEmail,
      });
      setSuccessfulCreation(true);
      setForgotStatus(null);
      setForgotStep("code");
      setForgotError("");
    } catch (err) {
      setForgotStatus("error");
      let message = "Failed to send code.";
      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        Array.isArray((err as { errors?: { longMessage?: string }[] }).errors)
      ) {
        message =
          (err as { errors?: { longMessage?: string }[] }).errors?.[0]
            ?.longMessage || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setForgotError(message);
    }
  };

  const handleForgotReset = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setForgotStatus("pending");
    setForgotError("");
    if (newPassword !== verifyNewPassword) {
      setForgotError("Passwords do not match.");
      setForgotStatus(null);
      return;
    }
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: forgotCode,
        password: newPassword,
      });
      if (result?.status === "needs_second_factor") {
        setSecondFactor(true);
        setForgotError("");
      } else if (result?.status === "complete") {
        await setActive?.({ session: result.createdSessionId });
        setForgotError("");
        setForgotStatus(null);
        setForgotStep("success");
        toaster.create({
          title: "Password Reset Successful",
          description: "You can now sign in with your new password.",
          type: "success",
        });
        setTimeout(() => {
          setIsForgotOpen(false);
          setForgotStep("email");
          setForgotEmail("");
          setForgotCode("");
          setNewPassword("");
          setVerifyNewPassword("");
          setForgotError("");
          setSuccessfulCreation(false);
          setSecondFactor(false);
          navigate("/sign-in");
        }, 2000);
      } else {
        setForgotError("Unexpected result. Please try again.");
      }
    } catch (err) {
      setForgotStatus("error");
      let message = "Failed to reset password.";
      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        Array.isArray((err as { errors?: { longMessage?: string }[] }).errors)
      ) {
        message =
          (err as { errors?: { longMessage?: string }[] }).errors?.[0]
            ?.longMessage || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setForgotError(message);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      position="relative"
      bg="gray.50"
    >
      {/* Background Image */}
      {/*<Image*/}
      {/*  src={studentImg}*/}
      {/*  alt="Student"*/}
      {/*  objectFit="contain"*/}
      {/*  opacity={0.3}*/}
      {/*  position="absolute"*/}
      {/*  top={0}*/}
      {/*  left={0}*/}
      {/*  width="100%"*/}
      {/*  height="100%"*/}
      {/*  zIndex={0}*/}
      {/*/>*/}
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
        <Image
          src={logo}
          alt="logo"
          objectFit="contain"
          opacity={0.3}
          top={0}
          left={0}
          width="25%"
          height="25%"
          zIndex={0}
        />
        <Heading size="lg" color="primary.900" mb={6} textAlign="center">
          Instructor Sign In
        </Heading>
        <form
          style={{ width: "100%" }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <Field.Root mb={4}>
            <Field.Label>Email</Field.Label>
            <Input
              placeholder="Enter your .edu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </Field.Root>
          <Field.Root mb={6}>
            <Field.Label>Password</Field.Label>
            <Input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </Field.Root>
          <CustomButton title="Sign In" type="submit" />
        </form>
        <Button
          variant="ghost"
          colorScheme="blue"
          mt={2}
          onClick={() => setIsForgotOpen(true)}
        >
          Forgot Password?
        </Button>
        <CustomModal
          isOpen={isForgotOpen}
          onClose={() => {
            setIsForgotOpen(false);
            setForgotStatus(null);
            setForgotEmail("");
            setForgotStep("email");
            setForgotCode("");
            setNewPassword("");
            setVerifyNewPassword("");
            setForgotError("");
            setSuccessfulCreation(false);
            setSecondFactor(false);
          }}
          title="Forgot Password"
          footer={
            !successfulCreation ? (
              <Button
                colorScheme="blue"
                loading={forgotStatus === "pending"}
                onClick={handleForgotSendCode}
                disabled={!forgotEmail || forgotStatus === "success"}
              >
                Send Code
              </Button>
            ) : (
              <Button
                colorScheme="blue"
                loading={forgotStatus === "pending"}
                onClick={handleForgotReset}
                disabled={
                  !forgotCode ||
                  !newPassword ||
                  !verifyNewPassword ||
                  forgotStatus === "success"
                }
              >
                Reset Password
              </Button>
            )
          }
        >
          {!successfulCreation && (
            <>
              <Text mb={2}>Enter your email to receive a reset code.</Text>
              <Input
                placeholder="Enter your .edu email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                type="email"
                mb={2}
                disabled={forgotStatus === "success"}
              />
            </>
          )}
          {successfulCreation && (
            <>
              <Text mb={2}>
                Enter the code sent to your email and set a new password.
              </Text>
              <Input
                placeholder="Reset code"
                value={forgotCode}
                onChange={(e) => setForgotCode(e.target.value)}
                mb={2}
              />
              <Input
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                mb={2}
              />
              <Input
                placeholder="Verify new password"
                value={verifyNewPassword}
                onChange={(e) => setVerifyNewPassword(e.target.value)}
                type="password"
                mb={2}
              />
              {secondFactor && (
                <Text color="orange.500">
                  2FA is required, but this UI does not handle that.
                </Text>
              )}
            </>
          )}
          {forgotStep === "success" && (
            <Text color="green.500">
              Password reset! Redirecting to sign in...
            </Text>
          )}
          {forgotError && <Text color="red.500">{forgotError}</Text>}
        </CustomModal>
        <Text mt={6} color="gray.600" fontSize="sm" textAlign="center">
          Only instructors can sign in here. Students should use the attendance
          link provided by their professor.
        </Text>
        <Text
          mt={2}
          color="blue.600"
          fontSize="sm"
          textAlign="center"
          cursor="pointer"
          onClick={() => navigate("/signup")}
        >
          Don&apos;t have an account? Sign up here.
        </Text>
      </Container>
    </Flex>
  );
};

export default SignInPage;
