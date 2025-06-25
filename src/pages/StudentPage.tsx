import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Field,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import QRCode from "react-qr-code";
import CustomButton from "../components/ui/CustomButton.tsx";
import { toaster } from "../components/ui/toaster.tsx";
import type { Sheet } from "../types";

const SHEETS_API = "http://localhost:4000/sheets";
const LOGS_API = "http://localhost:4000/logs";

const StudentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sheetIdFromUrl = searchParams.get("sheetId");
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [studentName, setStudentName] = useState("");
  const [secretKeyInput, setSecretKeyInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (sheetIdFromUrl) {
      axios
        .get(`${SHEETS_API}/${sheetIdFromUrl}`)
        .then((res) => {
          const data = res.data;
          if (!data?.isActive) throw new Error("Inactive sheet");
          setSheet(data);
        })
        .catch(() => {
          toaster.create({
            title: "No active sheet",
            description: "Please ask your professor to open a sheet.",
            type: "warning",
          });
          navigate("/");
        });
    }
  }, [sheetIdFromUrl, navigate]);

  const handleSubmit = async () => {
    if (!sheet) return;

    if (secretKeyInput.trim() !== sheet.secretKey) {
      toaster.create({
        title: "Invalid secret key",
        description: "Please check the key provided by your professor.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(LOGS_API, {
        sheetId: sheet.id,
        id: crypto.randomUUID(),
        name: studentName,
        signedInAt: new Date().toISOString(),
        className: sheet.className,
      });

      toaster.create({
        title: "Submitted",
        description: "Your attendance has been submitted!",
        type: "success",
      });

      setStudentName("");
      setSecretKeyInput("");
    } catch (err) {
      console.error("Failed to submit", err);
      toaster.create({
        title: "Error",
        description: "Failed to submit. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sheet) {
    return (
      <Flex
        height="100vh"
        align="center"
        justify="center"
        direction="column"
        p="6"
      >
        <Spinner size="xl" />
        <Text mt="4" color="gray.600">
          Loading sheet...
        </Text>
      </Flex>
    );
  }

  return (
    <Box boxSize="md" w="100%">
      <Flex height="100vh" direction="column" p="4">
        <Heading fontWeight="bold" color="primary.900" mb={4}>
          Student Sign In
        </Heading>

        <Flex flex="1" gap="8" p="4" direction={{ base: "column", md: "row" }}>
          {/* QR */}
          <Flex flex="1" align="center" justify="center" p="4">
            <QRCode
              value={`${window.location.origin}/student?sheetId=${sheet.id}`}
              size={240}
            />
          </Flex>

          {/* Form */}
          <Flex flex="1" direction="column" gap="4">
            <Container maxW="md">
              <Field.Root mb={4}>
                <Field.Label>Name</Field.Label>
                <Input
                  placeholder="Your name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </Field.Root>

              <Field.Root mb={4}>
                <Field.Label>Secret Key (ask professor)</Field.Label>
                <Input
                  placeholder="Enter secret key"
                  value={secretKeyInput}
                  onChange={(e) => setSecretKeyInput(e.target.value)}
                />
              </Field.Root>

              <CustomButton
                title="Submit"
                onClick={handleSubmit}
                disabled={!studentName || !secretKeyInput || isSubmitting}
                loading={isSubmitting}
              />
            </Container>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default StudentPage;
