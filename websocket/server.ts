import { Patient } from "@/features/patient/types/patient.type";
import { ClientMessage } from "@/features/realtime/types";
import { updatePatientValue } from "@/shared/utils/updatePatientValues";
import { randomUUID } from "node:crypto";
import { WebSocket, WebSocketServer } from "ws";

export interface PatientSession {
  socket: WebSocket;
  nickname: string;
  connectedAt: number;
  values: Patient["values"];
}

export interface SubmittedPatient {
  patientId: string;
  nickname: string;
  connectedAt: number;
  values: Patient["values"];
}

const port = Number(process.env.PORT) || 8080;

const wss = new WebSocketServer({
  port,
});

const patients = new Map<string, PatientSession>();
const socketToPatient = new Map<WebSocket, string>();
const staffSockets = new Set<WebSocket>();
const patientActivityTimers = new Map<string, NodeJS.Timeout>();
const submittedPatients = new Map<string, SubmittedPatient>();
const submittedPatientTimers = new Map<string, NodeJS.Timeout>();
const patientFocusedFields = new Map<string, string>();

const broadcastToStaff = (message: object) => {
  const response = JSON.stringify(message);

  staffSockets.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(response);
    }
  });
};

const handlePatientJoin = (socket: WebSocket, nickname?: string) => {
  const patientId = randomUUID();
  const patientNickname = nickname ?? "Patient";

  const patient: PatientSession = {
    socket,
    nickname: patientNickname,
    connectedAt: Date.now(),
    values: {
      firstname: "",
      middlename: "",
      lastname: "",
      dateOfBirth: "",
      gender: "",
      phoneNumber: "",
      email: "",
      address: "",
      preferredLanguage: "",
      nationality: "",
      religion: "",
      emergencyContact: {
        name: "",
        relationship: "",
      },
    },
  };

  patients.set(patientId, patient);
  socketToPatient.set(socket, patientId);

  console.log(`Patient connected: ${patientNickname} (${patientId})`);

  socket.send(
    JSON.stringify({
      type: "PATIENT_ID_ASSIGNED",
      patientId,
    }),
  );

  broadcastToStaff({
    type: "PATIENT_CONNECTED",
    nickname: patientNickname,
    patientId,
    connectedAt: patient.connectedAt,
    values: patient.values,
  });
};

const handleStaffJoin = (socket: WebSocket) => {
  staffSockets.add(socket);

  console.log("Staff connected");

  patients.forEach((patient, patientId) => {
    socket.send(
      JSON.stringify({
        type: "PATIENT_CONNECTED",
        patientId,
        connectedAt: patient.connectedAt,
        nickname: patient.nickname,
        values: patient.values,
        focusedField: patientFocusedFields.get(patientId),
      }),
    );
  });

  submittedPatients.forEach((patient) => {
    socket.send(
      JSON.stringify({
        type: "PATIENT_SUBMITTED",
        patientId: patient.patientId,
        nickname: patient.nickname,
        connectedAt: patient.connectedAt,
        values: patient.values,
      }),
    );
  });

  socket.send(
    JSON.stringify({
      type: "STAFF_READY",
    }),
  );
};

const handlePatientActive = (patientId: string) => {
  const patient = patients.get(patientId);

  if (!patient || submittedPatients.has(patientId)) {
    return;
  }

  broadcastToStaff({
    type: "PATIENT_ACTIVE",
    patientId,
  });

  const existingTimer = patientActivityTimers.get(patientId);

  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(() => {
    patientActivityTimers.delete(patientId);

    if (submittedPatients.has(patientId)) {
      return;
    }

    broadcastToStaff({
      type: "PATIENT_IDLE",
      patientId,
    });
  }, 3000);

  patientActivityTimers.set(patientId, timer);
};

const handlePatientFieldFocus = (patientId: string, field: string) => {
  const patient = patients.get(patientId);

  if (!patient || submittedPatients.has(patientId)) {
    return;
  }

  patientFocusedFields.set(patientId, field);

  broadcastToStaff({
    type: "PATIENT_FIELD_FOCUS",
    patientId,
    field,
  });
};

const handlePatientFieldBlur = (patientId: string) => {
  const patient = patients.get(patientId);

  if (!patient || submittedPatients.has(patientId)) {
    return;
  }

  patientFocusedFields.delete(patientId);

  broadcastToStaff({
    type: "PATIENT_FIELD_BLUR",
    patientId,
  });
};

const handlePatientFieldUpdate = (
  patientId: string,
  field: string,
  value: string,
) => {
  const patient = patients.get(patientId);

  if (!patient || submittedPatients.has(patientId)) {
    return;
  }

  patient.values = updatePatientValue(patient.values, field, value);

  broadcastToStaff({
    type: "PATIENT_FIELD_UPDATE",
    patientId,
    field,
    value,
  });
};

const handlePatientSubmitted = (patientId: string) => {
  const patient = patients.get(patientId);

  if (!patient || submittedPatients.has(patientId)) {
    return;
  }

  patientFocusedFields.delete(patientId);

  const activityTimer = patientActivityTimers.get(patientId);

  if (activityTimer) {
    clearTimeout(activityTimer);
    patientActivityTimers.delete(patientId);
  }

  submittedPatients.set(patientId, {
    patientId,
    nickname: patient.nickname,
    connectedAt: patient.connectedAt,
    values: patient.values,
  });

  const existingSubmittedTimer = submittedPatientTimers.get(patientId);

  if (existingSubmittedTimer) {
    clearTimeout(existingSubmittedTimer);
  }

  const submittedTimer = setTimeout(
    () => {
      submittedPatients.delete(patientId);
      submittedPatientTimers.delete(patientId);

      broadcastToStaff({
        type: "PATIENT_EXPIRED",
        patientId,
      });
    },
    30 * 60 * 1000,
  );

  submittedPatientTimers.set(patientId, submittedTimer);

  broadcastToStaff({
    type: "PATIENT_SUBMITTED",
    patientId,
    nickname: patient.nickname,
    connectedAt: patient.connectedAt,
    values: patient.values,
  });
};

const handlePatientLeave = (patientId: string) => {
  const patient = patients.get(patientId);

  if (!patient || submittedPatients.has(patientId)) {
    return;
  }

  const activityTimer = patientActivityTimers.get(patientId);

  if (activityTimer) {
    clearTimeout(activityTimer);
    patientActivityTimers.delete(patientId);
  }

  patientFocusedFields.delete(patientId);
  patients.delete(patientId);
  socketToPatient.delete(patient.socket);

  broadcastToStaff({
    type: "PATIENT_DISCONNECTED",
    nickname: patient.nickname,
    patientId,
  });

  patient.socket.close();
};

const handleDisconnect = (socket: WebSocket) => {
  const patientId = socketToPatient.get(socket);

  if (!patientId) {
    staffSockets.delete(socket);
    console.log("Staff disconnected");
    return;
  }

  const activityTimer = patientActivityTimers.get(patientId);

  if (activityTimer) {
    clearTimeout(activityTimer);
    patientActivityTimers.delete(patientId);
  }

  const patient = patients.get(patientId);

  patients.delete(patientId);
  socketToPatient.delete(socket);
  patientFocusedFields.delete(patientId);

  if (!patient) {
    return;
  }

  if (submittedPatients.has(patientId)) {
    return;
  }

  console.log(`Patient disconnected: ${patient.nickname} (${patientId})`);

  broadcastToStaff({
    type: "PATIENT_DISCONNECTED",
    nickname: patient.nickname,
    patientId,
  });
};

wss.on("connection", (socket) => {
  socket.on("message", (rawMessage) => {
    const message = JSON.parse(rawMessage.toString()) as ClientMessage;

    switch (message.type) {
      case "JOIN":
        if (message.role === "patient") {
          handlePatientJoin(socket, message.nickname);
        } else {
          handleStaffJoin(socket);
        }
        break;

      case "PATIENT_ACTIVE":
        handlePatientActive(message.patientId);
        break;

      case "PATIENT_FIELD_FOCUS":
        handlePatientFieldFocus(message.patientId, message.field);
        break;

      case "PATIENT_FIELD_BLUR":
        handlePatientFieldBlur(message.patientId);
        break;

      case "PATIENT_FIELD_UPDATE":
        handlePatientFieldUpdate(
          message.patientId,
          message.field,
          message.value,
        );
        break;

      case "PATIENT_SUBMITTED":
        handlePatientSubmitted(message.patientId);
        break;

      case "PATIENT_LEAVE":
        handlePatientLeave(message.patientId);
        break;
    }
  });

  socket.on("close", () => {
    handleDisconnect(socket);
  });
});

console.log(`WebSocket server running on ${port}`);
