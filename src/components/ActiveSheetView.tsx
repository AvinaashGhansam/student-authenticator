import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import QRCode from "react-qr-code";
import { useActiveSheet } from "../contexts/active-sheet-context.tsx";
import CustomButton from "./ui/CustomButton";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toaster } from "./ui/toaster.tsx";

type ActiveSheetViewProps = {
  onClose: () => void;
};
const SHEETS_API = "http://localhost:4000/sheets";

const ActiveSheetView = ({ onClose }: ActiveSheetViewProps) => {
  const { activeSheet } = useActiveSheet();
  const [sheetInfo, setSheetInfo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeSheet?.sheetId) {
      axios
        .get(`${SHEETS_API}/${activeSheet.sheetId}`)
        .then((res) => setSheetInfo(res.data))
        .catch(() => {
          toaster.create({
            title: "Error",
            description: "Failed to load sheet details.",
            type: "error",
          });
        });
    }
  }, [activeSheet?.sheetId]);

  if (!activeSheet?.isActive || !sheetInfo) {
    return null;
  }

  const qrUrl = `${window.location.origin}/student?sheetId=${sheetInfo.id}`;

  return (
    <Box mt={6} p={4} borderWidth="1px" borderRadius="md" bg="white">
      <Heading size="md" mb={2}>
        Active Sheet
      </Heading>
      <Text mb={2}>Share this QR code with students:</Text>
      <QRCode value={qrUrl} size={180} />
      <Text mt={2} fontSize="sm" color="gray.500">
        Sheet ID: {activeSheet.sheetId}
      </Text>
      <Text mt={1} fontSize="sm" color="gray.500">
        Secret Key: {activeSheet.secretKey}
      </Text>

      <Flex mt={4} gap={3} justify="flex-end">
        <CustomButton
          title="View Large QR"
          onClick={() => navigate(`/sheet/${activeSheet.sheetId}`)}
        />
        <CustomButton title="Close Sheet" bg="warning.900" onClick={onClose} />
      </Flex>
    </Box>
  );
};

export default ActiveSheetView;
