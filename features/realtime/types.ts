import { Patient, PatientField } from "@/features/patient/types/patient.type";

export type ClientMessage =
  | {
      type: "JOIN";
      role: "patient" | "staff";
      nickname?: string;
    }
  | {
      type: "PATIENT_ACTIVE";
      patientId: string;
    }
  | {
      type: "PATIENT_FIELD_FOCUS";
      patientId: string;
      field: string;
    }
  | {
      type: "PATIENT_FIELD_BLUR";
      patientId: string;
    }
  | {
      type: "PATIENT_FIELD_UPDATE";
      patientId: string;
      field: string;
      value: string;
    }
  | {
      type: "PATIENT_SUBMITTED";
      patientId: string;
    };

export type ServerMessage =
  | {
      type: "PATIENT_CONNECTED";
      nickname: string;
      patientId: string;
      connectedAt: number;
      values: Patient["values"];
      focusedField?: PatientField;
    }
  | {
      type: "PATIENT_DISCONNECTED";
      nickname: string;
      patientId: string;
    }
  | {
      type: "PATIENT_ACTIVE";
      patientId: string;
    }
  | {
      type: "PATIENT_IDLE";
      patientId: string;
    }
  | {
      type: "PATIENT_FIELD_FOCUS";
      patientId: string;
      field: PatientField;
    }
  | {
      type: "PATIENT_FIELD_BLUR";
      patientId: string;
    }
  | {
      type: "PATIENT_FIELD_UPDATE";
      patientId: string;
      field: string;
      value: string;
    }
  | {
      type: "PATIENT_SUBMITTED";
      patientId: string;
      nickname: string;
      connectedAt: number;
      values: Patient["values"];
    }
  | {
      type: "PATIENT_EXPIRED";
      patientId: string;
    }
  | {
      type: "PATIENT_ID_ASSIGNED";
      patientId: string;
    }
  | {
      type: "STAFF_READY";
    };
