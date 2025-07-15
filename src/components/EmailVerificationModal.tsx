import Modal from "react-modal";
import { Field, Flex, Heading, Input, Text } from "@chakra-ui/react";
import CustomButton from "./ui/CustomButton";
import { BeatLoader } from "react-spinners";

Modal.setAppElement("#root");

type EmailVerificationModalProps = {
  isOpen: boolean;
  email: string;
  code: string;
  error: string;
  isVerifying: boolean;
  onClose: () => void;
  onVerify: () => void;
  onChangeCode: (value: string) => void;
};

const EmailVerificationModal = ({
  isOpen,
  email,
  code,
  error,
  isVerifying,
  onClose,
  onVerify,
  onChangeCode,
}: EmailVerificationModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          maxHeight: "450px",
          minHeight: "350px", // Stable height
          overflowY: "auto",
          padding: "24px",
        },
      }}
      contentLabel="Email Verification"
    >
      <Heading size="md" mb={4}>
        Verify your Email
      </Heading>
      <Text mb={4}>
        We sent a verification code to <b>{email}</b>
      </Text>

      <Field.Root>
        <Field.Label>Verification Code</Field.Label>
        <Input
          placeholder="123456"
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
        />
      </Field.Root>

      {error && (
        <Text
          lineClamp="2"
          color="warning.900"
          mt={3}
          mb={1}
          fontWeight="bold"
          textAlign="center"
        >
          {error}
        </Text>
      )}

      <Flex justify="flex-end" gap={4} mt={6}>
        <CustomButton title="Cancel" bg="warning.900" onClick={onClose} />
        <CustomButton
          loading={isVerifying}
          title="Verify"
          onClick={onVerify}
          spinner={<BeatLoader size={8} color="white" />}
          disabled={isVerifying || code.trim() === ""}
        />
      </Flex>
    </Modal>
  );
};

export default EmailVerificationModal;
