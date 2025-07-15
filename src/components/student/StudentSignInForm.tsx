import { Container, Field, Input } from "@chakra-ui/react";
import CustomButton from "../ui/CustomButton";
import React from "react";

interface StudentSignInFormProps {
  firstName: string;
  lastName: string;
  studentId: string;
  secretKeyInput: string;
  isSubmitting: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

const StudentSignInForm: React.FC<StudentSignInFormProps> = ({
  firstName,
  lastName,
  studentId,
  secretKeyInput,
  isSubmitting,
  onChange,
  onSubmit,
}) => (
  <Container maxW="md" p={0}>
    <Field.Root mb={4}>
      <Field.Label>First Name</Field.Label>
      <Input
        placeholder="First Name"
        value={firstName}
        onChange={(e) => onChange("firstName", e.target.value)}
        bg="background.primary"
        color="text.primary"
        _placeholder={{ color: "text.secondary" }}
        borderColor="primary.400"
      />
      <Field.Label>Last Name</Field.Label>
      <Input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => onChange("lastName", e.target.value)}
        bg="background.primary"
        color="text.primary"
        _placeholder={{ color: "text.secondary" }}
        borderColor="primary.400"
      />
      <Field.Label color="text.primary">Student Id</Field.Label>
      <Input
        placeholder="Your name"
        value={studentId}
        onChange={(e) => onChange("studentId", e.target.value)}
        bg="background.primary"
        color="text.primary"
        _placeholder={{ color: "text.secondary" }}
        borderColor="primary.400"
      />
      <Field.Label color="warning.900" fontWeight="bold">
        Secret Key (ask professor)
      </Field.Label>
      <Input
        placeholder="Enter secret key"
        value={secretKeyInput}
        color="warning.900"
        onChange={(e) => onChange("secretKeyInput", e.target.value)}
        bg="background.primary"
        _placeholder={{ color: "text.secondary" }}
        borderColor="primary.400"
      />
    </Field.Root>
    <CustomButton
      title="Submit"
      onClick={onSubmit}
      disabled={
        !firstName || !lastName || !studentId || !secretKeyInput || isSubmitting
      }
      loading={isSubmitting}
      w="100%"
      mt={2}
    />
  </Container>
);

export default StudentSignInForm;
