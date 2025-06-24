import { Flex, Heading, Input, InputGroup, Table } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import AttendanceForm from "../components/AttendanceForm.tsx";
import { useState } from "react";
import CustomButton from "../components/ui/CustomButton.tsx";
import { useAuth } from "@clerk/clerk-react";
import { toaster } from "../components/ui/toaster.tsx";

const items = [
  {
    className: "Intro to Computer Science",
    dateCreated: "2025-06-01",
    reportId: "8b3a9f2a-3b4c-4d1f-a937-12a4567890ab",
  },
  {
    className: "Calculus I",
    dateCreated: "2025-06-02",
    reportId: "c5f7d9b4-2d4e-4a3b-b876-90cde456abcd",
  },
  {
    className: "English Literature",
    dateCreated: "2025-06-03",
    reportId: "9f6e8a1c-7c8b-4d5f-9a1b-23ef56789acd",
  },
  {
    className: "Physics II",
    dateCreated: "2025-06-04",
    reportId: "e3b5c7f2-5d9a-4f2c-8b7d-34ab67890def",
  },
  {
    className: "Modern World History",
    dateCreated: "2025-06-05",
    reportId: "b6e8d1f3-4c5b-4a2f-9e1a-45cd7890abcde",
  },
];

const ProfessorDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const { signOut /*isLoading*/ } = useAuth();
  // TODO: implement loading

  const handleSignOut = async () => {
    try {
      await signOut();
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

  return (
    <>
      <Flex bg="background.primary" height="100vh" direction="column" p="4">
        <Heading fontWeight="bold" color="primary.900">
          Welcome, Professor John
        </Heading>
        <Flex as="header" width="100%" justify="flex-end">
          <CustomButton
            onClick={handleSignOut}
            title="Sign Out"
            bg="warning.900"
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
                    <Table.ColumnHeader textAlign="end">
                      Report Id
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {items.map((item) => (
                    <Table.Row key={item.reportId}>
                      <Table.Cell>{item.className}</Table.Cell>
                      <Table.Cell>{item.dateCreated}</Table.Cell>
                      <Table.Cell textAlign="end">{item.reportId}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>

            <CustomButton
              title="Create Sheet"
              onClick={() => setShowForm(true)}
            />
          </Flex>

          {/* Right side: Form */}
          {showForm && <AttendanceForm onCancel={() => setShowForm(false)} />}
        </Flex>
      </Flex>
    </>
  );
};

export default ProfessorDashboard;
