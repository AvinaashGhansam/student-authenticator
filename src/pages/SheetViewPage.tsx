import { Box, Button, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { useActiveSheet } from "../contexts/active-sheet-context";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

const SheetViewPage = () => {
  const navigate = useNavigate();
  const { sheetId } = useParams();
  const { activeSheet } = useActiveSheet();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/sign-in", { replace: true });
    }
  }, [isSignedIn, navigate]);

  const qrValue = `${window.location.origin}/student?sheet=${sheetId}`;

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
          <Heading size="lg" color="primary.900" mb={4} textAlign="center">
            Attendance QR Code
          </Heading>
        </Flex>
        <QRCode value={qrValue} size={280} style={{ margin: "0 auto" }} />
        <Text mt={4} fontSize="lg" color="gray.600" textAlign="center">
          Sheet ID: {sheetId}
        </Text>
        {activeSheet?.secretKey && (
          <Text
            mt={6}
            fontSize="3xl"
            color="primary.900"
            textAlign="center"
            fontWeight="bold"
            letterSpacing="wide"
          >
            Secret Key: {activeSheet.secretKey}
          </Text>
        )}
        <Button
          onClick={() => navigate("/professor-dashboard")}
          mt={8}
          w="100%"
          size="sm"
          bg="primary.700"
          color="white"
          _hover={{ bg: "primary.900", color: "white" }}
          borderRadius="md"
          fontWeight="bold"
        >
          ← Back to Dashboard
        </Button>
      </Box>
    </Flex>
  );
};

export default SheetViewPage;
