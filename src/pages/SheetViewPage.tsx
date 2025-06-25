import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { useActiveSheet } from "../contexts/active-sheet-context";

const SheetViewPage = () => {
  const navigate = useNavigate();
  const { sheetId } = useParams();
  const { activeSheet } = useActiveSheet();

  const qrValue = `${window.location.origin}/student?sheet=${sheetId}`;

  return (
    <Box boxSize="md" w="100%">
      <Flex
        height="100vh"
        direction="column"
        p="4"
        align="center"
        justify="center"
      >
        {/* Back to dashboard */}
        <Button
          onClick={() => navigate("/professor-dashboard")}
          mb={6}
          alignSelf="flex-start"
          colorScheme="blue"
        >
          ← Back to Dashboard
        </Button>

        <Heading size="lg" color="primary.900" mb={4}>
          Attendance QR Code
        </Heading>

        <QRCode value={qrValue} size={280} />

        <Text mt={4} fontSize="lg" color="gray.600">
          Sheet ID: {sheetId}
        </Text>

        {activeSheet?.secretKey && (
          <Text mt={2} fontSize="md" color="gray.600">
            Secret Key: {activeSheet.secretKey}
          </Text>
        )}
      </Flex>
    </Box>
  );
};

export default SheetViewPage;
