import { Box, Flex, Image, Heading } from "@chakra-ui/react";
import AttendanceForm from "../components/AttendanceForm.tsx";
import { useState, useEffect } from "react";
import CustomButton from "../components/ui/CustomButton.tsx";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toaster } from "../components/ui/toaster.tsx";
import { useActiveSheet } from "../contexts/active-sheet-context.tsx";
import { useSheets } from "../hooks/use-sheets.ts";
import ActiveSheetView from "../components/ActiveSheetView.tsx";
import { useNavigate } from "react-router-dom";
import Header from "../components/professor/Header";
import SearchBar from "../components/professor/SearchBar";
import SheetsTable from "../components/professor/SheetsTable";

const ProfessorDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { signOut, isSignedIn } = useAuth();
  const { setActiveSheet, activeSheet } = useActiveSheet();
  const { sheets, addSheet, deleteSheet, updateSheet, loading } = useSheets();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/sign-in", { replace: true });
    }
  }, [isSignedIn, navigate]);

  const handleSheetCreated = async (
    className: string,
    dateCreated: string,
    secretKey: string,
    location: { lat: string; lng: string },
    maxRadius: string,
  ) => {
    const createdBy = user?.id;
    const newSheetId = await addSheet({
      className,
      dateCreated,
      secretKey,
      location,
      maxRadius,
      createdBy,
    });
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

  // Filter sheets to only show those created by the current user
  const visibleSheets = user
    ? sheets.filter((sheet) => sheet.createdBy === user?.id)
    : [];

  // Filter by search term (class name)
  const filteredSheets = visibleSheets.filter((sheet) =>
    sheet.className.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-br, background.primary 60%, primary.100 100%)"
      p={{ base: 2, md: 8 }}
    >
      <Box
        w={{ base: "100%", sm: "90%", md: "1100px" }}
        bg="whiteAlpha.900"
        borderRadius="2xl"
        boxShadow="2xl"
        p={{ base: 4, md: 8 }}
        position="relative"
      >
        <Flex direction="column" align="center" mb={6}>
          <Image src="/logo.svg" alt="Logo" boxSize="64px" mb={2} />
          <Heading
            fontWeight="bold"
            color="primary.900"
            fontSize="2xl"
            textAlign="center"
            mb={2}
          >
            Professor Dashboard
          </Heading>
        </Flex>
        <Flex height="100%" direction="column" p="4">
          {/* Header */}
          <Header user={user} onSignOut={handleSignOut} />
          <Flex flex="1" gap="8" p="4">
            {/* Left side: Table + Button */}
            <Flex direction="column" flex="1" gap="4">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              <SheetsTable
                sheets={filteredSheets}
                loading={loading}
                activeSheet={activeSheet}
                onActivate={handleActivate}
                onViewLog={handleViewLog}
                onDelete={handleDelete}
              />
              <CustomButton
                title="Create Sheet"
                onClick={() => setShowForm(true)}
                _hover={{ bg: "text.secondary" }}
                bgColor="primary.50"
                color="primary.900"
              />
            </Flex>
            {/* Right side: Active Sheet View & Attendance Form */}
            <Flex direction="column" flex="1" gap="4">
              <ActiveSheetView onClose={handleCloseSheet} />
              {showForm && (
                <AttendanceForm
                  onCancel={() => setShowForm(false)}
                  onSheetCreated={handleSheetCreated}
                />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default ProfessorDashboard;
