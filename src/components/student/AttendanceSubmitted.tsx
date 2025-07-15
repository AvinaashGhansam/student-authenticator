import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

const AttendanceSubmitted: React.FC = () => (
  <Box p={6} textAlign="center" bg="green.50" borderRadius="md">
    <Heading size="md" color="green.700" mb={2}>
      Attendance Submitted
    </Heading>
    <Text color="green.700">
      You have already submitted your attendance for this class.
    </Text>
  </Box>
);

export default AttendanceSubmitted;
