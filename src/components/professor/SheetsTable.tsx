import { Table, Flex } from "@chakra-ui/react";
import CustomButton from "../ui/CustomButton";
import type { Sheet } from "../../types";
import type { ActiveSheet } from "../../contexts/active-sheet-context";
import React from "react";

interface SheetsTableProps {
  sheets: Sheet[];
  loading: boolean;
  activeSheet: ActiveSheet | null;
  onActivate: (sheetId: string, secretKey: string) => void;
  onViewLog: (sheetId: string) => void;
  onDelete: (sheetId: string) => void;
}

const SheetsTable: React.FC<SheetsTableProps> = ({
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
          sheets.map((sheet) => (
            <Table.Row
              key={sheet.id}
              _hover={{ bg: "gray.50", cursor: "pointer" }}
              onClick={() => onViewLog(sheet.id)}
            >
              <Table.Cell>{sheet.className}</Table.Cell>
              <Table.Cell>{sheet.dateCreated}</Table.Cell>
              <Table.Cell>{sheet.reportId ?? "-"}</Table.Cell>
              <Table.Cell
                textAlign="center"
                onClick={(e) => e.stopPropagation()}
              >
                <Flex gap="2" justify="center" flexWrap="wrap">
                  <CustomButton
                    title="Activate"
                    size="sm"
                    onClick={() => onActivate(sheet.id, sheet.secretKey!)}
                    disabled={
                      activeSheet?.sheetId === sheet.id && activeSheet?.isActive
                    }
                  />
                  <CustomButton
                    title="View Log"
                    size="sm"
                    onClick={() => onViewLog(sheet.id)}
                  />
                  <CustomButton
                    title="Delete"
                    size="sm"
                    bg="warning.900"
                    onClick={() => onDelete(sheet.id)}
                  />
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table.Root>
  </Table.ScrollArea>
);

export default SheetsTable;
