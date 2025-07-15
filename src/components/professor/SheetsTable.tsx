import { Table, Flex } from "@chakra-ui/react";
import CustomButton from "../ui/CustomButton";
import type { Sheet } from "../../types";

import type { ActiveSheet } from "../../contexts/active-sheet-context";
import type { FC } from "react";

interface SheetsTableProps {
  sheets: Sheet[];
  loading: boolean;
  activeSheet: ActiveSheet | null;
  onActivate: (sheetId: string, secretKey: string) => void;
  onViewLog: (sheetId: string) => void;
  onDelete: (sheetId: string) => void;
}

const SheetsTable: FC<SheetsTableProps> = ({
  sheets,
  loading,
  activeSheet,
  onActivate,
  onViewLog,
  onDelete,
}) => (
  <Table.ScrollArea borderWidth="1px" rounded="md" height="300px">
    <Table.Root size="lg" stickyHeader>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Class Name</Table.ColumnHeader>
          <Table.ColumnHeader>Date Created</Table.ColumnHeader>
          <Table.ColumnHeader>Report ID</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="center">Actions</Table.ColumnHeader>
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
          sheets.map((sheet) => {
            const isActive =
              activeSheet &&
              activeSheet.sheetId === sheet._id &&
              activeSheet.isActive;
            return (
              <Table.Row
                key={sheet._id}
                _hover={{
                  bg: isActive ? "primary.50" : "gray.50",
                  cursor: "pointer",
                }}
                bg={isActive ? "primary.50" : undefined}
                fontWeight={isActive ? "bold" : "normal"}
                onClick={() => onViewLog(sheet._id)}
              >
                <Table.Cell>{sheet.className}</Table.Cell>
                <Table.Cell>{sheet.dateCreated}</Table.Cell>
                <Table.Cell>{sheet.reportId ?? "-"}</Table.Cell>
                <Table.Cell
                  textAlign="center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Flex
                    gap="2"
                    justify="center"
                    align="center"
                    flexWrap="nowrap"
                  >
                    <CustomButton
                      title={isActive ? "Active" : "Activate"}
                      size="xs"
                      px={3}
                      py={1}
                      fontSize="sm"
                      bg={isActive ? "primary.900" : "primary.700"}
                      color="white"
                      _hover={
                        isActive
                          ? { bg: "primary.900" }
                          : { bg: "primary.900", color: "white" }
                      }
                      onClick={() =>
                        !isActive &&
                        onActivate(sheet._id, sheet.secretKey || "")
                      }
                      disabled={!!isActive}
                    />
                    <CustomButton
                      title="View Log"
                      size="xs"
                      px={3}
                      py={1}
                      fontSize="sm"
                      bg="primary.100"
                      color="primary.900"
                      variant="outline"
                      _hover={{
                        bg: "primary.200",
                        color: "primary.900",
                        borderColor: "primary.900",
                      }}
                      onClick={() => onViewLog(sheet._id)}
                    />
                    <CustomButton
                      title="Delete"
                      size="xs"
                      px={3}
                      py={1}
                      fontSize="sm"
                      bg="red.500"
                      color="white"
                      _hover={{ bg: "red.600", color: "white" }}
                      onClick={() => onDelete(sheet._id)}
                    />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            );
          })
        )}
      </Table.Body>
    </Table.Root>
  </Table.ScrollArea>
);

export default SheetsTable;
