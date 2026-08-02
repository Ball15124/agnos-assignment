// features/patient/hooks/usePatientRealtime.test.ts
import { renderHook, act } from "@testing-library/react";
import usePatientRealtime from "./usePatientRealtime";

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  url: string;
  readyState: number = WebSocket.CONNECTING;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onclose: (() => void) | null = null;
  sentMessages: string[] = [];
  closed = false;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  send(data: string) {
    this.sentMessages.push(data);
  }

  close() {
    this.closed = true;
    this.readyState = WebSocket.CLOSED;
    this.onclose?.();
  }

  // Test helpers
  triggerOpen() {
    this.readyState = WebSocket.OPEN;
    this.onopen?.();
  }

  triggerMessage(data: unknown) {
    this.onmessage?.({ data: JSON.stringify(data) });
  }
}

beforeEach(() => {
  MockWebSocket.instances = [];
  // @ts-expect-error - overriding global WebSocket with mock for tests
  global.WebSocket = MockWebSocket;
  Object.assign(global.WebSocket, {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
  });
});

const getLastSocket = () =>
  MockWebSocket.instances[MockWebSocket.instances.length - 1];

const parseSent = (socket: MockWebSocket, index = 0) =>
  JSON.parse(socket.sentMessages[index]);

describe("usePatientRealtime", () => {
  it("does not open a connection when nickname is null", () => {
    renderHook(() => usePatientRealtime(null));

    expect(MockWebSocket.instances.length).toBe(0);
  });

  it("opens a connection and sends JOIN when nickname is provided", () => {
    renderHook(() => usePatientRealtime("Jane"));

    const socket = getLastSocket();
    expect(socket).toBeDefined();

    act(() => {
      socket.triggerOpen();
    });

    const message = parseSent(socket);
    expect(message).toEqual({
      type: "JOIN",
      role: "patient",
      nickname: "Jane",
    });
  });

  it("sets patientId when PATIENT_ID_ASSIGNED is received", () => {
    const { result } = renderHook(() => usePatientRealtime("Jane"));
    const socket = getLastSocket();

    act(() => {
      socket.triggerOpen();
    });

    expect(result.current.patientId).toBeNull();

    act(() => {
      socket.triggerMessage({
        type: "PATIENT_ID_ASSIGNED",
        patientId: "patient-123",
      });
    });

    expect(result.current.patientId).toBe("patient-123");
  });

  it("does not send events before patientId is assigned", () => {
    const { result } = renderHook(() => usePatientRealtime("Jane"));
    const socket = getLastSocket();

    act(() => {
      socket.triggerOpen();
    });

    act(() => {
      result.current.handleFormActivity("firstname", "John");
    });

    // Only the JOIN message should have been sent
    expect(socket.sentMessages.length).toBe(1);
  });

  it("sends PATIENT_ACTIVE and PATIENT_FIELD_UPDATE on form activity", () => {
    const { result } = renderHook(() => usePatientRealtime("Jane"));
    const socket = getLastSocket();

    act(() => {
      socket.triggerOpen();
      socket.triggerMessage({
        type: "PATIENT_ID_ASSIGNED",
        patientId: "patient-123",
      });
    });

    act(() => {
      result.current.handleFormActivity("firstname", "John");
    });

    // messages[0] = JOIN, [1] = PATIENT_ACTIVE, [2] = PATIENT_FIELD_UPDATE
    expect(parseSent(socket, 1)).toEqual({
      type: "PATIENT_ACTIVE",
      patientId: "patient-123",
    });
    expect(parseSent(socket, 2)).toEqual({
      type: "PATIENT_FIELD_UPDATE",
      patientId: "patient-123",
      field: "firstname",
      value: "John",
    });
  });

  it("sends PATIENT_FIELD_FOCUS and PATIENT_FIELD_BLUR", () => {
    const { result } = renderHook(() => usePatientRealtime("Jane"));
    const socket = getLastSocket();

    act(() => {
      socket.triggerOpen();
      socket.triggerMessage({
        type: "PATIENT_ID_ASSIGNED",
        patientId: "patient-123",
      });
    });

    act(() => {
      result.current.handleFieldFocus("email");
    });
    expect(parseSent(socket, 1)).toEqual({
      type: "PATIENT_FIELD_FOCUS",
      patientId: "patient-123",
      field: "email",
    });

    act(() => {
      result.current.handleFieldBlur("email");
    });
    expect(parseSent(socket, 2)).toEqual({
      type: "PATIENT_FIELD_BLUR",
      patientId: "patient-123",
      field: "email",
    });
  });

  it("sends PATIENT_SUBMITTED on form submit", () => {
    const { result } = renderHook(() => usePatientRealtime("Jane"));
    const socket = getLastSocket();

    act(() => {
      socket.triggerOpen();
      socket.triggerMessage({
        type: "PATIENT_ID_ASSIGNED",
        patientId: "patient-123",
      });
    });

    act(() => {
      result.current.handleFormSubmit();
    });

    expect(parseSent(socket, 1)).toEqual({
      type: "PATIENT_SUBMITTED",
      patientId: "patient-123",
    });
  });

  it("sends PATIENT_LEAVE and closes the socket on handlePatientLeave", () => {
    const { result } = renderHook(() => usePatientRealtime("Jane"));
    const socket = getLastSocket();

    act(() => {
      socket.triggerOpen();
      socket.triggerMessage({
        type: "PATIENT_ID_ASSIGNED",
        patientId: "patient-123",
      });
    });

    act(() => {
      result.current.handlePatientLeave();
    });

    expect(parseSent(socket, 1)).toEqual({
      type: "PATIENT_LEAVE",
      patientId: "patient-123",
    });
    expect(socket.closed).toBe(true);
  });

  it("does not send PATIENT_LEAVE if the socket is not open", () => {
    const { result } = renderHook(() => usePatientRealtime("Jane"));
    const socket = getLastSocket();

    act(() => {
      socket.triggerMessage({
        type: "PATIENT_ID_ASSIGNED",
        patientId: "patient-123",
      });
    });

    // socket never triggered open, so readyState is still CONNECTING
    act(() => {
      result.current.handlePatientLeave();
    });

    expect(socket.sentMessages.length).toBe(0);
  });

  it("closes the socket on unmount", () => {
    const { unmount } = renderHook(() => usePatientRealtime("Jane"));
    const socket = getLastSocket();

    act(() => {
      socket.triggerOpen();
    });

    unmount();

    expect(socket.closed).toBe(true);
  });
});