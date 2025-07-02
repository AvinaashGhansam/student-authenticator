import { useState } from "react";
import Modal from "react-modal";
import {
  Box,
  Container,
  Field,
  Flex,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import CustomButton from "../components/ui/CustomButton.tsx";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toaster } from "../components/ui/toaster.tsx";
import { useClerk } from "@clerk/clerk-react";
import EmailVerificationModal from "../components/EmailVerificationModal.tsx";
import { EmailIcon, LockIcon, InfoIcon } from "@chakra-ui/icons";

Modal.setAppElement("#root");

const SignUpPage = () => {
  const navigate = useNavigate();
  const { user } = useClerk();
  const { signUp, isLoaded, setActive } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

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
        unsafeMetadata: { university },
      });
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
            <Box display="flex" alignItems="center">
              <EmailIcon color="gray.400" mr={2} />
              <Input
                placeholder="Enter your .edu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </Box>
          </Field.Root>
          <Field.Root mb={4}>
            <Field.Label>Password</Field.Label>
            <Box display="flex" alignItems="center">
              <LockIcon color="gray.400" mr={2} />
              <Input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </Box>
          </Field.Root>
          <Field.Root mb={4}>
            <Field.Label>Verify Password</Field.Label>
            <Box display="flex" alignItems="center">
              <LockIcon color="gray.400" mr={2} />
              <Input
                placeholder="Re-enter password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                type="password"
                required
              />
            </Box>
          </Field.Root>
          <Field.Root mb={6}>
            <Field.Label>University Name</Field.Label>
            <Input
              placeholder="Enter your university name"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              required
            />
          </Field.Root>
          <CustomButton
            title="Sign Up"
            type="submit"
            loading={isSubmitting}
            disabled={!email || !password || !verifyPassword || !university || isSubmitting}
          />
        </form>
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
