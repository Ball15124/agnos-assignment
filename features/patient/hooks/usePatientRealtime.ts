import { ServerMessage } from "@/features/realtime/types";
import { useEffect, useRef, useState } from "react";

const usePatientRealtime = (nickname: string | null) => {
  const [patientId, setPatientId] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!nickname) return;

    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080",
    );
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Patient connected");

      socket.send(
        JSON.stringify({
          type: "JOIN",
          role: "patient",
          nickname,
        }),
      );
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as ServerMessage;

      if (message.type === "PATIENT_ID_ASSIGNED") {
        setPatientId(message.patientId);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      socketRef.current = null;
    };

    return () => {
      socket.close();
    };
  }, [nickname]);

  const handleFormActivity = (field: string, value: string) => {
    if (!patientId) return;

    socketRef.current?.send(
      JSON.stringify({
        type: "PATIENT_ACTIVE",
        patientId,
      }),
    );

    socketRef.current?.send(
      JSON.stringify({
        type: "PATIENT_FIELD_UPDATE",
        patientId,
        field,
        value,
      }),
    );
  };

  const handleFieldFocus = (field: string) => {
    if (!patientId) return;

    socketRef.current?.send(
      JSON.stringify({
        type: "PATIENT_FIELD_FOCUS",
        patientId,
        field,
      }),
    );
  };

  const handleFieldBlur = (field: string) => {
    if (!patientId) return;

    socketRef.current?.send(
      JSON.stringify({
        type: "PATIENT_FIELD_BLUR",
        patientId,
        field,
      }),
    );
  };

  const handleFormSubmit = () => {
    if (!patientId) return;

    socketRef.current?.send(
      JSON.stringify({
        type: "PATIENT_SUBMITTED",
        patientId,
      }),
    );
  };

  const handlePatientLeave = () => {
    if (!patientId) return;

    const socket = socketRef.current;

    if (socket?.readyState !== WebSocket.OPEN) return;

    socket.send(
      JSON.stringify({
        type: "PATIENT_LEAVE",
        patientId,
      }),
    );

    socket.close();
  };

  return {
    patientId,
    handleFormActivity,
    handleFieldFocus,
    handleFieldBlur,
    handleFormSubmit,
    handlePatientLeave,
  };
};

export default usePatientRealtime;
