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
import { BeatLoader } from "react-spinners";
import EmailVerificationModal from "../components/EmailVerificationModal.tsx";

Modal.setAppElement("#root");

const SignUpPage = () => {
  const navigate = useNavigate();
  const { user } = useClerk();
  const { signUp, isLoaded, setActive } = useSignUp();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  // TODO: Button Sign Up
  // TODO: Spinner

  const [verifyEmail, setVerifyEmail] = useState<{
    state: "default" | "pending" | "success";
    error: string;
    code: string;
  }>({
    state: "default",
    code: "",
    error: "",
  });
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const isFormValid =
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.email.trim() !== "" &&
    form.password.trim() !== "" &&
    form.confirmPassword.trim() !== "" &&
    form.password === form.confirmPassword;

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setIsSigningUp(true);

    // TODO: enable
    /*
    if (!form.email.endsWith("@rowan.edu")) {
      toaster.create({
        title: "Invalid email",
        description: "Only @rowan.edu emails are allowed.",
        type: "error",
      });
      return;
    }*/

    try {
      await signUp?.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifyEmail({ ...verifyEmail, state: "pending" });
    } catch (error) {
      console.error("Signup error", error);
      if (error instanceof Error) {
        toaster.create({
          description: error?.message ?? "Signup failed.",
          type: "error",
        });
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setIsVerifying(true);

    try {
      const signUpAttempt = await signUp?.attemptEmailAddressVerification({
        code: verifyEmail.code,
      });

      if (signUpAttempt?.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        await user?.update({
          unsafeMetadata: {
            firstName: form.firstName,
            lastName: form.lastName,
          },
        });

        toaster.create({
          description: "Verification successful!",
          type: "success",
        });
        navigate("/professor-dashboard");
      } else {
        setVerifyEmail((prev) => ({
          state: "pending", // FORCE update to modal
          code: prev.code,
          error: "Verification failed. Please check the code.",
        }));
      }
    } catch (error) {
      console.error("Verification error", error);
      setVerifyEmail((prev) => ({
        state: "pending", // FORCE update to modal
        code: prev.code,
        error:
          error instanceof Error
            ? error.message
            : "Invalid verification code. Please try again.",
      }));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Box boxSize="md">
      <Flex direction="column" justifyContent="center" alignItems="flex-start">
        <Heading size="5xl" fontWeight="bold" color="primary.900" pl={2} mt={4}>
          Sign Up
        </Heading>
        <Container maxW="md" mt={10}>
          <Field.Root mb={4}>
            <Field.Label>First Name</Field.Label>
            <Input
              placeholder="John"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <Field.Label>Last Name</Field.Label>
            <Input
              placeholder="Doe"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
            <Field.Label>Email</Field.Label>
            <Input
              placeholder="me@example.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field.Root>

          <Field.Root mb={6}>
            <Field.Label>Password</Field.Label>
            <Input
              placeholder="••••••••"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Field.Label>Confirm Password</Field.Label>
            <Input
              placeholder="••••••••"
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </Field.Root>
          <Box id="clerk-captcha" mb={4} />
          <CustomButton
            title="Sign Up"
            onClick={onSignUpPress}
            mt={4}
            loading={isSigningUp}
            disabled={!isFormValid || isSigningUp}
            spinner={<BeatLoader size={8} color="white" />}
          />
          <Text
            fontWeight="light"
            color="text.secondary"
            mt={2}
            fontStyle="italic"
          >
            Already have an account?{" "}
            <CustomButton
              title="Sign In"
              bg="background.primary"
              color="primary.900"
              onClick={() => navigate("/signin")}
              variant="plain"
            />
          </Text>
        </Container>
      </Flex>
      <EmailVerificationModal
        isOpen={verifyEmail.state === "pending"}
        email={form.email}
        code={verifyEmail.code}
        error={verifyEmail.error}
        isVerifying={isVerifying}
        onClose={() =>
          setVerifyEmail({
            state: "default",
            code: "",
            error: "",
          })
        }
        onVerify={onVerifyPress}
        onChangeCode={(value) =>
          setVerifyEmail((prev) => ({
            ...prev,
            code: value,
            error: "",
          }))
        }
      />
    </Box>
  );
};

export default SignUpPage;
