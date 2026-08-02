"use client";
import { Patient } from "@/features/patient/types/patient.type";
import { formatDateTime, getStatusColor } from "../utils/staffHelper";

interface PatientTableProps {
  patients: Patient[];
  loading: boolean;
  onSelectPatientId?: (patientId: string | null) => void;
  selectedPatientId?: string;
}

const PatientTable = ({
  patients,
  loading,
  onSelectPatientId,
  selectedPatientId
}: PatientTableProps) => {
  return (
    <div className="w-full overflow-auto rounded-lg border border-gray-200">
      <table className="w-full text-left">
        <thead className="bg-primary text-white sticky top-0">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold">Status</th>
            <th className="px-4 py-3 text-sm font-semibold min-w-60">ConnectedAt</th>
            <th className="px-4 py-3 text-sm font-semibold max-w-50">Patient</th>
            <th className="px-4 py-3 text-sm font-semibold">ID</th>
          </tr>
        </thead>

        <tbody>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <tr
                key={patient.id}
                onClick={() => {
                  if (selectedPatientId === patient.id) {
                    onSelectPatientId?.(null);
                  } else {
                    onSelectPatientId?.(patient.id);
                  }
                }}
                className={`cursor-pointer border-t border-gray-200 hover:bg-primary/20 transition-colors duration-300 ${selectedPatientId === patient.id ? "bg-primary/20" : ""} `}
              >
                <td className="px-4 py-3 capitalize">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${getStatusColor(patient.status)}`}
                    />
                    {patient.status}
                  </div>
                </td>

                <td className="px-4 py-3 min-w-50">{formatDateTime(patient.connectedAt)}</td>

                <td className="px-4 py-3 max-w-50 truncate">{patient.nickname}</td>

                <td className="px-4 py-3 truncate">{patient.id}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                {loading
                  ? "Loading patients..."
                  : "There are no patients to display."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
