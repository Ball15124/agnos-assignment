import { Patient } from "@/features/patient/types/patient.type";
import { ServerMessage } from "@/features/realtime/types";
import { updatePatientValue } from "@/shared/utils/updatePatientValues";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface UseStaffRealtimeProps {
  setSelectedPatientId: Dispatch<SetStateAction<string | null>>;
}

const useStaffRealtime = ({ setSelectedPatientId }: UseStaffRealtimeProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080",
    );
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "JOIN",
          role: "staff",
        }),
      );
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as ServerMessage;

      switch (message.type) {
        case "PATIENT_CONNECTED":
          setPatients((prev) => {
            if (prev.some((patient) => patient.id === message.patientId)) {
              return prev;
            }

            return [
              ...prev,
              {
                id: message.patientId,
                status: "idle",
                nickname: message.nickname,
                connectedAt: message.connectedAt,
                values: message.values,
                focusedField: message.focusedField,
              },
            ];
          });
          break;

        case "PATIENT_DISCONNECTED":
          setPatients((prev) =>
            prev.map((patient) =>
              patient.id === message.patientId
                ? { ...patient, status: "disconnected" }
                : patient,
            ),
          );

          setTimeout(() => {
            setPatients((prev) =>
              prev.filter((patient) => patient.id !== message.patientId),
            );

            setSelectedPatientId((prev) =>
              prev === message.patientId ? null : prev,
            );
          }, 10000);

          break;

        case "PATIENT_ACTIVE":
          setPatients((prev) =>
            prev.map((patient) =>
              patient.id === message.patientId
                ? { ...patient, status: "active" }
                : patient,
            ),
          );
          break;

        case "PATIENT_IDLE":
          setPatients((prev) =>
            prev.map((patient) =>
              patient.id === message.patientId
                ? { ...patient, status: "idle" }
                : patient,
            ),
          );
          break;

        case "PATIENT_FIELD_FOCUS":
          setPatients((prev) =>
            prev.map((patient) =>
              patient.id === message.patientId
                ? { ...patient, focusedField: message.field }
                : patient,
            ),
          );
          break;

        case "PATIENT_FIELD_BLUR":
          setPatients((prev) =>
            prev.map((patient) =>
              patient.id === message.patientId
                ? { ...patient, focusedField: undefined }
                : patient,
            ),
          );
          break;

        case "PATIENT_FIELD_UPDATE":
          setPatients((prev) =>
            prev.map((patient) =>
              patient.id === message.patientId
                ? {
                    ...patient,
                    values: updatePatientValue(
                      patient.values,
                      message.field,
                      message.value,
                    ),
                  }
                : patient,
            ),
          );
          break;

        case "PATIENT_SUBMITTED":
          setPatients((prev) => {
            const existingPatient = prev.find(
              (patient) => patient.id === message.patientId,
            );

            if (existingPatient) {
              return prev.map((patient) =>
                patient.id === message.patientId
                  ? {
                      ...patient,
                      status: "submitted",
                      connectedAt: message.connectedAt,
                      values: message.values,
                    }
                  : patient,
              );
            }

            return [
              ...prev,
              {
                id: message.patientId,
                nickname: message.nickname,
                status: "submitted",
                connectedAt: message.connectedAt,
                values: message.values,
              },
            ];
          });
          break;

        case "PATIENT_EXPIRED":
          setPatients((prev) =>
            prev.filter((patient) => patient.id !== message.patientId),
          );

          setSelectedPatientId((prev) =>
            prev === message.patientId ? null : prev,
          );
          break;

        case "STAFF_READY":
          setLoading(false);
          break;
      }
    };

    return () => {
      socket.close();
    };
  }, [setSelectedPatientId]);

  return {
    patients,
    loading,
  };
};

export default useStaffRealtime;
