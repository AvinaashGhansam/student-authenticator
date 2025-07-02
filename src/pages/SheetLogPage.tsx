import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { Table } from "@chakra-ui/react"; // Chakra v3 component-based table
import axios from "axios";
import CustomButton from "../components/ui/CustomButton.tsx";
import type { Sheet } from "../types";

interface LogEntry {
  id: string;
  name: string;
  signedInAt: string;
  sheetId: string;
  className: string;
  studentId?: string;
  location?: { lat: number; lng: number };
  locationDenied?: boolean;
}

const SheetLogPage = () => {
  const { sheetId } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sheetId) return;
    setLoading(true);
    Promise.all([
      axios.get<LogEntry[]>(`http://localhost:4000/logs?sheetId=${sheetId}`),
      axios.get<Sheet>(`http://localhost:4000/sheets/${sheetId}`)
    ])
      .then(([logsRes, sheetRes]) => {
        setLogs(logsRes.data);
        setSheet(sheetRes.data);
        setError(false);
      })
      .catch((err) => {
        console.error("Failed to fetch logs or sheet", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sheetId]);

  if (loading) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" align="center" mt="20">
        <Text fontSize="lg" color="red.500" mb="4">
          Failed to load student logs. Please try again later.
        </Text>
        <CustomButton color="primary.900" title="Back to Dashboard" onClick={() => navigate("/professor-dashboard")}/>
      </Flex>
    );
  }

  // Helper to calculate distance between two lat/lng points in meters
  function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    function toRad(x: number) { return x * Math.PI / 180; }
    const R = 6371000; // meters
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Verification logic
  function isVerified(log: LogEntry): boolean {
    if (log.locationDenied) return false;
    if (!log.location || !sheet?.location || !sheet.maxRadius) return false;
    const dist = getDistance(
      Number(sheet.location.lat),
      Number(sheet.location.lng),
      Number(log.location.lat),
      Number(log.location.lng)
    );
    return dist <= Number(sheet.maxRadius);
  }

  // Parse name helper
  function parseName(name: string) {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };
    return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
  }

  const verifiedCount = logs.filter(isVerified).length;
  const unverifiedCount = logs.length - verifiedCount;

  return (
    <Box p="6">
      <Flex justify="space-between" align="center" mb="6">
        <Heading size="lg">Student Sign-In Log</Heading>
        <Button onClick={() => navigate("/professor-dashboard")} colorScheme="blue">
          Back to Dashboard
        </Button>
      </Flex>
      <Flex mb={4} gap={6} align="center">
        <Text fontWeight="bold">Total: {logs.length}</Text>
        <Text color="green.600" fontWeight="bold">Verified: {verifiedCount}</Text>
        <Text color="red.600" fontWeight="bold">Unverified: {unverifiedCount}</Text>
      </Flex>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Last Name</Table.ColumnHeader>
            <Table.ColumnHeader>First Name</Table.ColumnHeader>
            <Table.ColumnHeader>Student ID</Table.ColumnHeader>
            <Table.ColumnHeader>Signed In At</Table.ColumnHeader>
            <Table.ColumnHeader>Class Name</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {logs.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={6}>
                <Text textAlign="center" py="4">
                  No students have signed in yet.
                </Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            logs.map((entry) => {
              const { firstName, lastName } = parseName(entry.name);
              const verified = isVerified(entry);
              let status = "Verified";
              if (entry.locationDenied) status = "Location Not Shared";
              else if (!verified) status = "Out of Bounds";
              return (
                <Table.Row key={entry.id} bg={!verified ? "red.50" : undefined}>
                  <Table.Cell>{lastName}</Table.Cell>
                  <Table.Cell>{firstName}</Table.Cell>
                  <Table.Cell>{entry.studentId || "-"}</Table.Cell>
                  <Table.Cell>{new Date(entry.signedInAt).toLocaleString()}</Table.Cell>
                  <Table.Cell>{entry.className}</Table.Cell>
                  <Table.Cell color={!verified ? "red.600" : "green.600"}>{status}</Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default SheetLogPage;
