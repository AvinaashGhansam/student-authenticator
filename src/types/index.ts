export type Sheet = {
  id: string;
  reportId: string | null;
  className: string;
  dateCreated: string;
  secretKey: string | null;
  isActive: boolean;
  location?: { lat: string; lng: string };
  maxRadius?: string;
  createdBy?: string;
};
