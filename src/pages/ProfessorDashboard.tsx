import { Box, Flex, Heading, Input, InputGroup, Table } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import AttendanceForm from "../components/AttendanceForm.tsx";
import { useState } from "react";
import CustomButton from "../components/ui/CustomButton.tsx";
import { useAuth } from "@clerk/clerk-react";
import { toaster } from "../components/ui/toaster.tsx";
import { useActiveSheet } from "../contexts/active-sheet-context.tsx";
import { useSheets } from "../hooks/use-sheets.ts";
import ActiveSheetView from "../components/ActiveSheetView.tsx";
import { useNavigate } from "react-router-dom";

const ProfessorDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const { signOut } = useAuth();
  const { setActiveSheet, activeSheet } = useActiveSheet();
  const { sheets, addSheet, deleteSheet, updateSheet, loading } = useSheets();
  const navigate = useNavigate();

  const handleSheetCreated = async (
    className: string,
    dateCreated: string,
    secretKey: string,
  ) => {
    const newSheetId = await addSheet({ className, dateCreated, secretKey });
    setActiveSheet({ sheetId: newSheetId!, isActive: true, secretKey });
    await updateSheet(newSheetId!, { isActive: true });
    setShowForm(false);
    toaster.create({
      title: "Sheet created",
      type: "success",
      description: `Sheet ${newSheetId} is now active.`,
    });
  };

  const handleActivate = async (sheetId: string, secretKey: string) => {
    setActiveSheet({ sheetId, isActive: true, secretKey });
    await updateSheet(sheetId, { isActive: true });
    toaster.create({
      title: "Sheet Activated",
      description: `Sheet ${sheetId} is now active.`,
      type: "success",
    });
  };

  const handleDelete = async (sheetId: string) => {
    await deleteSheet(sheetId);
    toaster.create({
      title: "Sheet Deleted",
      description: `Sheet ${sheetId} has been deleted.`,
      type: "success",
    });
  };

  const handleViewLog = (sheetId: string) => {
    navigate(`/sheet/${sheetId}/log`);
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirectUrl: "/" });
      toaster.create({
        title: "Signed out",
        type: "success",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Sign out failed",
        type: "error",
        description: "There was an issue signing you out.",
      });
    }
  };

  const handleCloseSheet = async () => {
    if (activeSheet?.sheetId) {
      await updateSheet(activeSheet.sheetId, { isActive: false });
    }
    setActiveSheet({ sheetId: "", isActive: false, secretKey: "" });
    toaster.create({
      title: "Sheet Closed",
      type: "info",
      description: "The active sheet has been closed.",
    });
  };

  return (
    <Box boxSize="md" w="100%">
      <Flex height="100vh" direction="column" p="4">
        {/* Header */}
        <Flex
          as="header"
          width="100%"
          align="center"
          justify="space-between"
          mb="4"
        >
          <Heading fontWeight="bold" color="primary.900">
            Welcome, Professor John
          </Heading>

          <CustomButton
            onClick={handleSignOut}
            title="Sign Out"
            bg="warning.900"
            display={{ base: "none", md: "inline-flex" }}
          />
        </Flex>

        <Flex flex="1" gap="8" p="4">
          {/* Left side: Table + Button */}
          <Flex direction="column" flex="1" gap="4">
            <InputGroup startElement={<LuSearch />}>
              <Input placeholder="Search by class name..." />
            </InputGroup>

            <Table.ScrollArea borderWidth="1px" rounded="md" height="300px">
              <Table.Root size="lg" stickyHeader>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Class Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Date Created</Table.ColumnHeader>
                    <Table.ColumnHeader>Report ID</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Actions
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {loading ? (
                    <Table.Row>
                      <Table.Cell colSpan={4}>Loading...</Table.Cell>
                    </Table.Row>
                  ) : sheets.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={4}>No sheets yet.</Table.Cell>
                    </Table.Row>
                  ) : (
                    sheets.map((sheet) => (
                      <Table.Row key={sheet.id} _hover={{ bg: "gray.50" }}>
                        <Table.Cell>{sheet.className}</Table.Cell>
                        <Table.Cell>{sheet.dateCreated}</Table.Cell>
                        <Table.Cell>{sheet.reportId}</Table.Cell>
                        <Table.Cell textAlign="center">
                          <Flex gap="2" justify="center" flexWrap="wrap">
                            <CustomButton
                              title="Activate"
                              size="sm"
                              onClick={() =>
                                handleActivate(sheet.id, sheet.secretKey!)
                              }
                              disabled={
                                activeSheet?.sheetId === sheet.id &&
                                activeSheet.isActive
                              }
                            />
                            <CustomButton
                              title="View Log"
                              size="sm"
                              onClick={() => handleViewLog(sheet.id)}
                            />
                            <CustomButton
                              title="Delete"
                              size="sm"
                              bg="warning.900"
                              onClick={() => handleDelete(sheet.id)}
                            />
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>

            <CustomButton
              title="Create Sheet"
              onClick={() => setShowForm(true)}
            />

            <ActiveSheetView onClose={handleCloseSheet} />
          </Flex>

          {/* Right side: Form */}
          {showForm && (
            <AttendanceForm
              onSheetCreated={handleSheetCreated}
              onCancel={() => setShowForm(false)}
            />
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default ProfessorDashboard;
