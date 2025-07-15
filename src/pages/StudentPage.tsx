import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import axios from "axios";
import { toaster } from "../components/ui/toaster.tsx";
import type { Sheet } from "../types";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import LocationModal from "../components/LocationModal";
import StudentSignInForm from "../components/student/StudentSignInForm";
import AttendanceSubmitted from "../components/student/AttendanceSubmitted";
import LoadingSheet from "../components/student/LoadingSheet";

const SHEETS_API = "http://localhost:3000/api/v1/sheets";
const LOGS_API = "http://localhost:3000/api/v1/logs";

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
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    // Only redirect if signed in AND not accessing via QR code (no sheetId)
    if (isSignedIn && !sheetIdFromUrl) {
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
  };

  // When location is checked, actually submit
  useEffect(() => {
    if (showLocationModal === false && locationChecked) {
      handleSubmit();
      setLocationChecked(false);
    }
  }, [showLocationModal, locationChecked]);

  const handleSubmit = async () => {
    // Validate fields after location is checked
    if (!firstName || !lastName || !studentId || !secretKeyInput) {
      toaster.create({
        title: "Missing Fields",
        description: "Please fill in all fields.",
        type: "error",
      });
      return;
    }
    if (secretKeyInput.trim() !== sheet?.secretKey) {
      toaster.create({
        title: "Invalid secret key",
        description: "Please check the key provided by your professor.",
        type: "error",
      });
      return;
    }
    if (!sheet) return;
    if (locationDenied) {
      toaster.create({
        title: "Location Required",
        description:
          "You must physically go see the professor to verify sign in.",
        type: "warning",
      });
      // Store denial in localStorage for later reference
      localStorage.setItem(`locationDenied_${sheet._id}_${studentId}`, "true");
      return;
    }
    // Check for previous submission only here
    if (
      localStorage.getItem(`attendance_${sheet._id}_${studentId}`) ===
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
        sheetId: sheet._id,
        id: crypto.randomUUID(),
        name: `${firstName} ${lastName}`.trim(),
        studentId: studentId,
        signedInAt: new Date().toISOString(),
        className: sheet.className,
        location: location ? { lat: location.lat, lng: location.lng } : null,
        locationDenied: locationDenied,
        fingerprint: fingerprint,
      });
      localStorage.setItem(`attendance_${sheet._id}_${studentId}`, "submitted");
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
    return <LoadingSheet />;
  }

  const handleFormChange = (field: string, value: string) => {
    if (field === "firstName") setFirstName(value);
    else if (field === "lastName") setLastName(value);
    else if (field === "studentId") setStudentId(value);
    else if (field === "secretKeyInput") setSecretKeyInput(value);
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-br, background.primary 60%, primary.100 100%)"
      p={{ base: 2, md: 8 }}
    >
      <Box
        w={{ base: "100%", sm: "90%", md: "480px" }}
        bg="whiteAlpha.900"
        borderRadius="2xl"
        boxShadow="2xl"
        p={{ base: 4, md: 8 }}
        position="relative"
      >
        <Flex direction="column" align="center" mb={6}>
          <Image src="/logo.svg" alt="Logo" boxSize="64px" mb={2} />
          <Heading
            fontWeight="bold"
            color="primary.900"
            fontSize="2xl"
            textAlign="center"
            mb={2}
          >
            Student Sign In
          </Heading>
        </Flex>
        <LocationModal
          isOpen={showLocationModal}
          onAllow={handleRequestLocation}
          onDeny={() => {
            setLocationDenied(true);
            setLocationChecked(true);
            setShowLocationModal(false);
          }}
          onClose={() => {
            setShowLocationModal(false);
            setLocationChecked(false);
          }}
        />
        <Flex direction="column" gap="8">
          <Flex direction="column" gap="4">
            {hasSubmitted ? (
              <AttendanceSubmitted />
            ) : (
              <StudentSignInForm
                firstName={firstName}
                lastName={lastName}
                studentId={studentId}
                secretKeyInput={secretKeyInput}
                isSubmitting={isSubmitting}
                onChange={handleFormChange}
                onSubmit={handlePreSubmit}
              />
            )}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default StudentPage;
