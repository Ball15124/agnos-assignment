import { Patient } from "@/features/patient/types/patient.type";
import { ServerMessage } from "@/features/realtime/types";
import { updatePatientValue } from "@/shared/utils/updatePatientValues";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface UseStaffRealtimeProps {
  setSelectedPatientId: Dispatch<SetStateAction<string | null>>;
}

const useStaffRealtime = ({setSelectedPatientId} : UseStaffRealtimeProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
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
      if (message.type === "PATIENT_CONNECTED") {
        setPatients((prev) => {
          const existingPatient = prev.find(
            (patient) => patient.id === message.patientId,
          );

          if (existingPatient) {
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
      }

      if (message.type === "PATIENT_DISCONNECTED") {
        setPatients((prev) =>
          prev.map((patient) =>
            patient.id === message.patientId
              ? {
                  ...patient,
                  status: "disconnected",
                }
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
      }

      if (message.type === "PATIENT_ACTIVE") {
        setPatients((prev) =>
          prev.map((patient) =>
            patient.id === message.patientId
              ? {
                  ...patient,
                  status: "active",
                }
              : patient,
          ),
        );
      }

      if (message.type === "PATIENT_FIELD_FOCUS") {
        setPatients((prev) =>
          prev.map((patient) =>
            patient.id === message.patientId
              ? {
                  ...patient,
                  focusedField: message.field,
                }
              : patient,
          ),
        );
      }

      if (message.type === "PATIENT_FIELD_BLUR") {
        setPatients((prev) =>
          prev.map((patient) =>
            patient.id === message.patientId
              ? {
                  ...patient,
                  focusedField: undefined,
                }
              : patient,
          ),
        );
      }

      if (message.type === "PATIENT_FIELD_UPDATE") {
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
      }

      if (message.type === "PATIENT_IDLE") {
        setPatients((prev) =>
          prev.map((patient) =>
            patient.id === message.patientId
              ? {
                  ...patient,
                  status: "idle",
                }
              : patient,
          ),
        );
      }

      if (message.type === "PATIENT_SUBMITTED") {
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
      }

      if (message.type === "PATIENT_EXPIRED") {
        setPatients((prev) =>
          prev.filter((patient) => patient.id !== message.patientId),
        );

        setSelectedPatientId((prev) =>
          prev === message.patientId ? null : prev,
        );
      }

      if (message.type === "STAFF_READY") {
        setLoading(false);
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
