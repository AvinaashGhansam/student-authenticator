import { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  Box,
  Container,
  Field,
  Flex,
  Heading,
  Input,
  Text,
  Button,
} from "@chakra-ui/react";
import CustomButton from "../components/ui/CustomButton.tsx";
import { useSignUp, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toaster } from "../components/ui/toaster.tsx";
import { useClerk } from "@clerk/clerk-react";
import EmailVerificationModal from "../components/EmailVerificationModal.tsx";
import { LockIcon, InfoIcon, EditIcon } from "@chakra-ui/icons";
import { MdAlternateEmail } from "react-icons/md";
import CustomModal from "../components/ui/CustomModal.tsx";
import { saveUserToDb } from "../utils/userApi";
import { InputGroup, InputLeftElement } from "@chakra-ui/input";
import { LuSchool } from "react-icons/lu";

Modal.setAppElement("#root");

const SignUpPage = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { user } = useClerk();
  const { signUp, isLoaded, setActive } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const [verifyEmail, setVerifyEmail] = useState<{
    state: "default" | "pending" | "success";
    error: string;
    code: string;
  }>({
    state: "default",
    code: "",
    error: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (isSignedIn === false) return;
    if (isSignedIn) {
      navigate("/professor-dashboard", { replace: true });
    }
  }, [isSignedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith(".edu")) {
      toaster.create({
        title: "Invalid Email",
        description: "Only .edu emails are allowed for instructor sign up.",
        type: "error",
      });
      return;
    }
    if (password !== verifyPassword) {
      toaster.create({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        type: "error",
      });
      return;
    }
    if (!signUp) {
      toaster.create({
        title: "Sign Up Not Ready",
        description: "Sign up is not loaded. Please try again later.",
        type: "error",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: { university, firstName, lastName },
      });
      // Save user info to db.json
      await saveUserToDb({ email, firstName, lastName, university });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setShowVerificationModal(true);
      toaster.create({
        title: "Check your email",
        description: "A verification code has been sent to your .edu email.",
        type: "success",
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An error occurred.";
      toaster.create({
        title: "Sign Up Failed",
        description: errorMsg,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    try {
      const signUpAttempt = await signUp?.attemptEmailAddressVerification({
        code: verifyEmail.code,
      });
      if (signUpAttempt?.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        await user?.update({
          unsafeMetadata: {
            firstName: "",
            lastName: "",
          },
        });
        toaster.create({
          description: "Verification successful!",
          type: "success",
        });
        setShowVerificationModal(false);
        navigate("/professor-dashboard");
      } else {
        setVerifyEmail((prev) => ({
          state: "pending",
          code: prev.code,
          error: "Verification failed. Please check the code.",
        }));
      }
    } catch (error) {
      setVerifyEmail((prev) => ({
        state: "pending",
        code: prev.code,
        error:
          error instanceof Error
            ? error.message
            : "Invalid verification code. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotStatus("pending");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setForgotStatus("success");
      toaster.create({
        title: "Check your email",
        description: "A password reset code has been sent to your email.",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setForgotStatus("error");
      toaster.create({
        title: "Error",
        description: "Failed to send reset code. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Container maxW="md" p={8} bg="white" borderRadius="lg" boxShadow="lg">
        <Box mb={6} textAlign="center">
          <InfoIcon boxSize={8} color="blue.500" mb={2} />
          <Heading size="lg" color="primary.900" mb={2}>
            Instructor Sign Up
          </Heading>
          <Text color="gray.600" fontWeight="bold">
            This sign up is for{" "}
            <span style={{ color: "#3182ce" }}>instructors only</span>. Students
            should not use this form.
          </Text>
        </Box>
        <form onSubmit={handleSubmit}>
          <Field.Root mb={4}>
            <Field.Label>Email (.edu only)</Field.Label>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                height="100%"
                display="flex"
                alignItems="center"
                pl={2}
              >
                <MdAlternateEmail color="gray.400" size={12} />
              </InputLeftElement>
              <Input
                pl={10}
                placeholder="Enter your .edu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </InputGroup>
          </Field.Root>
          <Field.Root mb={4}>
            <Field.Label>First Name</Field.Label>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                height="100%"
                display="flex"
                alignItems="center"
                pl={2}
              >
                <EditIcon color="gray.400" boxSize={12} />
              </InputLeftElement>
              <Input
                pl={10}
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </InputGroup>
          </Field.Root>
          <Field.Root mb={4}>
            <Field.Label>Last Name</Field.Label>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                height="100%"
                display="flex"
                alignItems="center"
                pl={2}
              >
                <EditIcon color="gray.400" boxSize={12} />
              </InputLeftElement>
              <Input
                pl={10}
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </InputGroup>
          </Field.Root>
          <Field.Root mb={6}>
            <Field.Label>University Name</Field.Label>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                height="100%"
                display="flex"
                alignItems="center"
                pl={2}
              >
                <LuSchool color="gray.400" size={12} />
              </InputLeftElement>
              <Input
                pl={10}
                placeholder="Enter your university name"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                required
              />
            </InputGroup>
          </Field.Root>
          <Field.Root mb={4}>
            <Field.Label>Password</Field.Label>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                height="100%"
                display="flex"
                alignItems="center"
                pl={2}
              >
                <LockIcon color="gray.400" boxSize={12} />
              </InputLeftElement>
              <Input
                pl={10}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </InputGroup>
          </Field.Root>
          <Field.Root mb={6}>
            <Field.Label>Verify Password</Field.Label>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                height="100%"
                display="flex"
                alignItems="center"
                pl={2}
              >
                <LockIcon color="gray.400" boxSize={12} />
              </InputLeftElement>
              <Input
                pl={10}
                placeholder="Re-enter password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                type="password"
                required
              />
            </InputGroup>
          </Field.Root>
          <CustomButton
            title="Sign Up"
            type="submit"
            loading={isSubmitting}
            disabled={
              !email ||
              !password ||
              !verifyPassword ||
              !firstName ||
              !lastName ||
              !university ||
              isSubmitting
            }
          />
        </form>
        <Text
          mt={4}
          color="blue.500"
          textAlign="center"
          _hover={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => setIsForgotOpen(true)}
        >
          Forgot Password?
        </Text>
        <Text
          mt={2}
          color="blue.600"
          fontSize="sm"
          textAlign="center"
          cursor="pointer"
          onClick={() => navigate("/sign-in")}
        >
          Already have an account? Sign in here.
        </Text>
        <CustomModal
          isOpen={isForgotOpen}
          onClose={() => setIsForgotOpen(false)}
          title="Forgot Password"
          footer={
            <Button
              colorScheme="blue"
              loading={forgotStatus === "pending"}
              onClick={handleForgotPassword}
              disabled={!forgotEmail || forgotStatus === "success"}
            >
              Send Code
            </Button>
          }
        >
          <Text mb={2}>Enter your email to receive a reset code.</Text>
          <Input
            placeholder="Enter your .edu email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            type="email"
            mb={2}
            disabled={forgotStatus === "success"}
          />
          {forgotStatus === "success" && (
            <Text color="green.500">Code sent! Check your email.</Text>
          )}
          {forgotStatus === "error" && (
            <Text color="red.500">Failed to send code. Try again.</Text>
          )}
        </CustomModal>
      </Container>
      <EmailVerificationModal
        isOpen={showVerificationModal}
        email={email}
        code={verifyEmail.code}
        error={verifyEmail.error}
        isVerifying={isSubmitting}
        onClose={() => {
          setShowVerificationModal(false);
          setVerifyEmail({ state: "default", code: "", error: "" });
        }}
        onVerify={onVerifyPress}
        onChangeCode={(value) =>
          setVerifyEmail((prev) => ({
            ...prev,
            code: value,
            error: "",
          }))
        }
      />
    </Flex>
  );
};

export default SignUpPage;
