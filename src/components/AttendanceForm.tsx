import { Flex, Input } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import CustomButton from "./ui/CustomButton.tsx";
import { useState } from "react";
import { randomSecret } from "../utils";

const AttendanceForm = ({ onCancel }: { onCancel: () => void }) => {
  const [secret, setSecret] = useState("");
  return (
    <Flex
      direction="column"
      gap="4"
      p="6"
      border="1px solid"
      borderColor="gray.300"
      rounded="md"
      bg="white"
      width="100%"
    >
      <FormControl isRequired>
        <FormLabel>Course Title</FormLabel>
        <Input placeholder="Enter course title" />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Date</FormLabel>
        <Input type="date" />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Secret Key</FormLabel>
        <Input
          placeholder="Enter secret key"
          defaultValue={secret}
          fontWeight="bold"
          color="warning.900"
        />
        <CustomButton
          title="Generate Random Secret Key"
          onClick={() => setSecret(randomSecret())}
          mt="2"
          bg="primary.400"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Location Radius (Meters)</FormLabel>
        <Input type="number" />
      </FormControl>
      <Flex justify="flex-end" gap="4" mt="4">
        <CustomButton title="Cancel" bg="warning.900" onClick={onCancel} />

        <CustomButton
          title="Submit"
          onClick={() => {
            console.log("Submitted");
          }}
        />
      </Flex>
    </Flex>
  );
};

export default AttendanceForm;
