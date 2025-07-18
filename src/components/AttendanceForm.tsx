import { Box, Flex, Heading, Input, Field } from "@chakra-ui/react";
import CustomButton from "./ui/CustomButton";
import { useState } from "react";
import { BeatLoader } from "react-spinners";

type AttendanceFormProps = {
  onSheetCreated: (
    className: string,
    dateCreated: string,
    secretKey: string,
    location: { lat: string; lng: string },
    maxRadius: string,
  ) => void;
  onCancel: () => void;
};

const AttendanceForm = ({ onSheetCreated, onCancel }: AttendanceFormProps) => {
  const [form, setForm] = useState({
    className: "",
    date: "",
    secretKey: "",
    maxRadius: "",
    location: { lat: "", lng: "" },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleUseLocation = () => {
    if (!navigator.geolocation) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          location: {
            lat: pos.coords.latitude.toString(),
            lng: pos.coords.longitude.toString(),
          },
        }));
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
        alert("Failed to get location. Please allow location access.");
      },
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const newDate = form.date || new Date().toISOString().split("T")[0];
    onSheetCreated(
      form.className,
      newDate,
      form.secretKey,
      form.location,
      form.maxRadius,
    );
    setIsSubmitting(false);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="2xl"
      p={{ base: 4, md: 8 }}
      width={{ base: "100%", sm: "90%", md: "420px" }}
      bg="whiteAlpha.900"
      boxShadow="2xl"
      mx="auto"
    >
      <Heading size="md" mb="4" color="primary.900" textAlign="center">
        Create New Attendance Sheet
      </Heading>

      <Field.Root mb={4}>
        <Field.Label>Course Title</Field.Label>
        <Input
          placeholder="Enter course title"
          value={form.className}
          onChange={(e) => setForm({ ...form, className: e.target.value })}
          bg="background.primary"
          color="text.primary"
          _placeholder={{ color: "text.secondary" }}
          borderColor="primary.400"
        />
      </Field.Root>

      <Field.Root mb={4}>
        <Field.Label>Date</Field.Label>
        <Input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          bg="background.primary"
          color="text.primary"
          borderColor="primary.400"
        />
      </Field.Root>

      <Field.Root mb={4}>
        <Field.Label>Secret Key</Field.Label>
        <Input
          placeholder="Enter secret key"
          value={form.secretKey}
          onChange={(e) => setForm({ ...form, secretKey: e.target.value })}
          bg="background.primary"
          color="text.primary"
          _placeholder={{ color: "text.secondary" }}
          borderColor="primary.400"
        />
      </Field.Root>

      <Field.Root mb={4}>
        <Field.Label>Max Radius (meters)</Field.Label>
        <Input
          type="number"
          placeholder="Enter max radius in meters"
          value={form.maxRadius}
          onChange={(e) => setForm({ ...form, maxRadius: e.target.value })}
          bg="background.primary"
          color="text.primary"
          _placeholder={{ color: "text.secondary" }}
          borderColor="primary.400"
        />
      </Field.Root>
      <Field.Root mb={4}>
        <Field.Label>Location (lat, lng)</Field.Label>
        <Flex gap={2}>
          <Input
            placeholder="Latitude"
            value={form.location.lat}
            readOnly
            bg="background.primary"
            color="text.primary"
            borderColor="primary.400"
          />
          <Input
            placeholder="Longitude"
            value={form.location.lng}
            readOnly
            bg="background.primary"
            color="text.primary"
            borderColor="primary.400"
          />
          <CustomButton
            title={locationLoading ? "Getting..." : "Use My Location"}
            onClick={handleUseLocation}
            disabled={locationLoading}
            size="sm"
            bg="primary.700"
            color="white"
            _hover={{ bg: "primary.900", color: "white" }}
          />
        </Flex>
      </Field.Root>

      <Flex justify="flex-end" gap={4} mt={6}>
        <CustomButton
          title="Cancel"
          bg="warning.900"
          color="white"
          _hover={{ bg: "warning.800", color: "white" }}
          onClick={onCancel}
        />
        <CustomButton
          title="Submit"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={
            !form.className ||
            !form.secretKey ||
            !form.maxRadius ||
            !form.location.lat ||
            !form.location.lng ||
            isSubmitting
          }
          spinner={<BeatLoader size={8} color="white" />}
          bg="primary.700"
          color="white"
          _hover={{ bg: "primary.900", color: "white" }}
        />
      </Flex>
    </Box>
  );
};

export default AttendanceForm;
