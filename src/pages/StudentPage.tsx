import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
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
  Button,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/modal";
import axios from "axios";
import CustomButton from "../components/ui/CustomButton.tsx";
import { toaster } from "../components/ui/toaster.tsx";
import type { Sheet } from "../types";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const SHEETS_API = "http://localhost:4000/sheets";
const LOGS_API = "http://localhost:4000/logs";

const StudentPage = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sheetIdFromUrl = searchParams.get("sheetId");
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [secretKeyInput, setSecretKeyInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locationDenied, setLocationDenied] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      navigate("/signed-in-student", { replace: true });
      return;
    }
    if (sheetIdFromUrl) {
      axios
        .get(`${SHEETS_API}/${sheetIdFromUrl}`)
        .then((res) => {
          const data = res.data;
          if (!data?.isActive) throw new Error("Inactive sheet");
          setSheet(data);
        })
        .catch(() => {
          navigate("/signed-in-student", { replace: true });
        });
    }
  }, [isSignedIn, sheetIdFromUrl, navigate]);

  // Generate fingerprint on mount
  useEffect(() => {
    FingerprintJS.load().then((fp) => {
      fp.get().then((result) => {
        setFingerprint(result.visitorId);
      });
    });
  }, []);

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationDenied(true);
      setLocationChecked(true);
      setShowLocationModal(false); // Close modal
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationDenied(false);
        setLocationChecked(true);
        setShowLocationModal(false); // Close modal
      },
      () => {
        setLocationDenied(true);
        setLocationChecked(true);
        setShowLocationModal(false); // Close modal
      },
    );
  };

  const handlePreSubmit = () => {
    setShowLocationModal(true);
    setPendingSubmit(true);
  };

  // When location is checked, actually submit
  useEffect(() => {
    if (pendingSubmit && locationChecked) {
      handleSubmit();
      setPendingSubmit(false);
    }
    // eslint-disable-next-line
  }, [pendingSubmit, locationChecked]);

  const handleSubmit = async () => {
    if (!sheet) return;
    if (locationDenied) {
      toaster.create({
        title: "Location Required",
        description:
          "You must physically go see the professor to verify sign in.",
        type: "warning",
      });
      // Store denial in localStorage for later reference
      localStorage.setItem(`locationDenied_${sheet.id}_${studentId}`, "true");
      return;
    }
    if (secretKeyInput.trim() !== sheet.secretKey) {
      toaster.create({
        title: "Invalid secret key",
        description: "Please check the key provided by your professor.",
        type: "error",
      });
      return;
    }
    // Check for previous submission only here
    if (
      localStorage.getItem(`attendance_${sheet.id}_${studentId}`) ===
      "submitted"
    ) {
      setHasSubmitted(true);
      toaster.create({
        title: "Already Submitted",
        description:
          "You have already submitted your attendance for this class.",
        type: "info",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(LOGS_API, {
        sheetId: sheet.id,
        id: crypto.randomUUID(),
        name: `${firstName} ${lastName}`.trim(),
        studentId: studentId,
        signedInAt: new Date().toISOString(),
        className: sheet.className,
        location: location ? { lat: location.lat, lng: location.lng } : null,
        locationDenied: locationDenied,
        fingerprint: fingerprint,
      });
      localStorage.setItem(`attendance_${sheet.id}_${studentId}`, "submitted");
      setHasSubmitted(true);
      toaster.create({
        title: "Submitted",
        description: "Your attendance has been submitted!",
        type: "success",
      });
      setFirstName("");
      setLastName("");
      setStudentId("");
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
      <Modal
        isOpen={showLocationModal}
        onClose={() => {
          setShowLocationModal(false);
          setLocationChecked(false);
        }}
        isCentered
        motionPreset="none"
      >
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent bg="white" color="black">
          <ModalHeader>Allow Location Access</ModalHeader>
          <ModalBody>
            <Text>
              To sign in, we need to verify your location. Please allow location
              access. If you deny, you must see the professor to verify your
              sign in.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleRequestLocation}>
              Allow
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setLocationDenied(true);
                setLocationChecked(true);
                setShowLocationModal(false);
              }}
            >
              Deny
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex height="100vh" direction="column" p="4">
        <Heading
          display="flex"
          fontWeight="bold"
          color="primary.900"
          mb={4}
          justifyContent="center"
          alignItems="center"
          fontSize="2xl"
        >
          Student Sign In
        </Heading>

        <Flex flex="1" gap="8" p="4" direction={{ base: "column", md: "row" }}>
          {/* Form */}
          <Flex flex="1" direction="column" gap="4">
            <Container maxW="md">
              {hasSubmitted ? (
                <Box p={6} textAlign="center" bg="green.50" borderRadius="md">
                  <Heading size="md" color="green.700" mb={2}>
                    Attendance Submitted
                  </Heading>
                  <Text color="green.700">
                    You have already submitted your attendance for this class.
                  </Text>
                </Box>
              ) : (
                <Field.Root mb={4}>
                  <Field.Label>First Name</Field.Label>
                  <Input
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    bg="background.primary"
                    color="text.primary"
                    _placeholder={{ color: "text.secondary" }}
                    borderColor="primary.400"
                  />
                  <Field.Label>Last Name</Field.Label>
                  <Input
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    bg="background.primary"
                    color="text.primary"
                    _placeholder={{ color: "text.secondary" }}
                    borderColor="primary.400"
                  />
                  <Field.Label color="text.primary">Student Id</Field.Label>
                  <Input
                    placeholder="Your name"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
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
                    onChange={(e) => setSecretKeyInput(e.target.value)}
                    bg="background.primary"
                    _placeholder={{ color: "text.secondary" }}
                    borderColor="primary.400"
                  />
                </Field.Root>
              )}
              {!hasSubmitted && (
                <CustomButton
                  title="Submit"
                  onClick={handlePreSubmit}
                  disabled={
                    !firstName ||
                    !lastName ||
                    !studentId ||
                    !secretKeyInput ||
                    isSubmitting
                  }
                  loading={isSubmitting}
                />
              )}
            </Container>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default StudentPage;
