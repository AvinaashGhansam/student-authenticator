import { useEffect, useState } from "react";
import axios from "axios";
import type { Sheet } from "../types";

const SHEETS_API = "http://localhost:3000/api/v1/sheets";

export const useSheets = () => {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchSheets();
  }, []);

  const fetchSheets = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(SHEETS_API);
      setSheets(data);
    } catch (error) {
      console.error("Error fetching sheets", error);
    } finally {
      setLoading(false);
    }
  };

  const addSheet = async (sheet: Partial<Sheet>) => {
    try {
      const reportId = `RPT-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      if (!sheet.className || !sheet.dateCreated || !sheet.secretKey) {
        throw new Error(
          "Missing required fields: className, dateCreated, or secretKey",
        );
      }
      const newSheet: Omit<Sheet, "_id"> = {
        reportId,
        className: sheet.className,
        dateCreated: sheet.dateCreated,
        secretKey: sheet.secretKey,
        isActive: sheet.isActive ?? false,
        location: sheet.location,
        maxRadius: sheet.maxRadius,
        createdBy: sheet.createdBy,
      };
      const { data: createdSheet } = await axios.post(SHEETS_API, newSheet);
      setSheets((prev) => [...prev, createdSheet]);
      return createdSheet._id;
    } catch (error) {
      console.error("Error adding sheet", error);
    }
  };

  const deleteSheet = async (_id: string) => {
    try {
      await axios.delete(`${SHEETS_API}/${_id}`);
      setSheets((prev) => prev.filter((s) => s._id !== _id));
    } catch (error) {
      console.error("Error deleting sheet", error);
    }
  };

  const updateSheet = async (_id: string, updates: Partial<Sheet>) => {
    try {
      await axios.patch(`${SHEETS_API}/${_id}`, updates);
      setSheets((prev) =>
        prev.map((s) => (s._id === _id ? { ...s, ...updates } : s)),
      );
    } catch (error) {
      console.error("Error updating sheet", error);
    }
  };

  return { sheets, loading, addSheet, deleteSheet, updateSheet };
};
