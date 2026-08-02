import { Patient } from "@/features/patient/types/patient.type";

export const getStatusColor = (status: Patient["status"]) => {
  switch (status) {
    case "idle":
      return "bg-gray-400";
    case "active":
      return "bg-green-400";
    case "submitted":
      return "bg-primary";
    case "disconnected":
      return "bg-red-500";
  }
};

export const formatDateTime = (timestamp: number) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
};
