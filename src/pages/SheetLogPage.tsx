import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { Table } from "@chakra-ui/react"; // Chakra v3 component-based table
import axios from "axios";

interface LogEntry {
  id: string;
  name: string;
  signedInAt: string;
  sheetId: string;
  className: string;
}

const SheetLogPage = () => {
  const { sheetId } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sheetId) return;

    axios
      .get<LogEntry[]>(`http://localhost:4000/logs?sheetId=${sheetId}`)
      .then((res) => {
        setLogs(res.data);
        setError(false);
      })
      .catch((err) => {
        console.error("Failed to fetch logs", err);
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
        <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
      </Flex>
    );
  }

  return (
    <Box p="6">
      <Flex justify="space-between" align="center" mb="6">
        <Heading size="lg">Student Sign-In Log</Heading>
        <Button onClick={() => navigate("/")} colorScheme="blue">
          Back to Dashboard
        </Button>
      </Flex>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Signed In At</Table.ColumnHeader>
            <Table.ColumnHeader>Class Name</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {logs.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={3}>
                <Text textAlign="center" py="4">
                  No students have signed in yet.
                </Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            logs.map((entry) => (
              <Table.Row key={entry.id}>
                <Table.Cell>{entry.name}</Table.Cell>
                <Table.Cell>
                  {new Date(entry.signedInAt).toLocaleString()}
                </Table.Cell>
                <Table.Cell>{entry.className}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default SheetLogPage;
