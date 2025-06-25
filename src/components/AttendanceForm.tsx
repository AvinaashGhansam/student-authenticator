import { Box, Flex, Heading, Input, Field } from "@chakra-ui/react";
import CustomButton from "./ui/CustomButton";
import { useState } from "react";
import { BeatLoader } from "react-spinners";

type AttendanceFormProps = {
  onSheetCreated: (
    className: string,
    dateCreated: string,
    secretKey: string,
  ) => void;
  onCancel: () => void;
};

const AttendanceForm = ({ onSheetCreated, onCancel }: AttendanceFormProps) => {
  const [form, setForm] = useState({
    className: "",
    date: "",
    secretKey: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const newDate = form.date || new Date().toISOString().split("T")[0];
    await onSheetCreated(form.className, newDate, form.secretKey);
    setIsSubmitting(false);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p="4"
      width="400px"
      bg="white"
      boxShadow="md"
    >
      <Heading size="md" mb="4" color="primary.900">
        Create New Attendance Sheet
      </Heading>

      <Field.Root mb={4}>
        <Field.Label>Course Title</Field.Label>
        <Input
          placeholder="Enter course title"
          value={form.className}
          onChange={(e) => setForm({ ...form, className: e.target.value })}
        />
      </Field.Root>

      <Field.Root mb={4}>
        <Field.Label>Date</Field.Label>
        <Input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
      </Field.Root>

      <Field.Root mb={4}>
        <Field.Label>Secret Key</Field.Label>
        <Input
          placeholder="Enter secret key"
          value={form.secretKey}
          onChange={(e) => setForm({ ...form, secretKey: e.target.value })}
        />
      </Field.Root>

      <Flex justify="flex-end" gap={4} mt={6}>
        <CustomButton title="Cancel" bg="warning.900" onClick={onCancel} />
        <CustomButton
          title="Submit"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={!form.className || !form.secretKey || isSubmitting}
          spinner={<BeatLoader size={8} color="white" />}
        />
      </Flex>
    </Box>
  );
};

export default AttendanceForm;
