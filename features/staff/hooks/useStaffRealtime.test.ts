// features/staff/hooks/useStaffRealtime.test.ts
import { renderHook, act } from "@testing-library/react";
import useStaffRealtime from "./useStaffRealtime";

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

const setup = () => {
  const setSelectedPatientId = jest.fn();
  const { result } = renderHook(() =>
    useStaffRealtime({ setSelectedPatientId }),
  );
  const socket = getLastSocket();

  act(() => {
    socket.triggerOpen();
  });

  return { result, socket, setSelectedPatientId };
};

describe("useStaffRealtime", () => {
  it("opens a connection and sends JOIN with role staff", () => {
    const { socket } = setup();

    const message = JSON.parse(socket.sentMessages[0]);
    expect(message).toEqual({ type: "JOIN", role: "staff" });
  });

  it("sets loading to false on STAFF_READY", () => {
    const { result, socket } = setup();

    expect(result.current.loading).toBe(true);

    act(() => {
      socket.triggerMessage({ type: "STAFF_READY" });
    });

    expect(result.current.loading).toBe(false);
  });

  it("adds a new patient on PATIENT_CONNECTED", () => {
    const { result, socket } = setup();

    act(() => {
      socket.triggerMessage({
        type: "PATIENT_CONNECTED",
        patientId: "p1",
        nickname: "Jane",
        connectedAt: 1000,
        values: { firstname: "Jane" },
        focusedField: undefined,
      });
    });

    expect(result.current.patients).toHaveLength(1);
    expect(result.current.patients[0]).toMatchObject({
      id: "p1",
      status: "idle",
      nickname: "Jane",
    });
  });

  it("does not duplicate a patient already in state on PATIENT_CONNECTED", () => {
    const { result, socket } = setup();

    act(() => {
      socket.triggerMessage({
        type: "PATIENT_CONNECTED",
        patientId: "p1",
        nickname: "Jane",
        connectedAt: 1000,
        values: {},
      });
      socket.triggerMessage({
        type: "PATIENT_CONNECTED",
        patientId: "p1",
        nickname: "Jane",
        connectedAt: 1000,
        values: {},
      });
    });

    expect(result.current.patients).toHaveLength(1);
  });

  it("marks patient as active on PATIENT_ACTIVE and idle on PATIENT_IDLE", () => {
    const { result, socket } = setup();

    act(() => {
      socket.triggerMessage({
        type: "PATIENT_CONNECTED",
        patientId: "p1",
        nickname: "Jane",
        connectedAt: 1000,
        values: {},
      });
      socket.triggerMessage({ type: "PATIENT_ACTIVE", patientId: "p1" });
    });
    expect(result.current.patients[0].status).toBe("active");

    act(() => {
      socket.triggerMessage({ type: "PATIENT_IDLE", patientId: "p1" });
    });
    expect(result.current.patients[0].status).toBe("idle");
  });

  it("updates focusedField on PATIENT_FIELD_FOCUS and clears it on PATIENT_FIELD_BLUR", () => {
    const { result, socket } = setup();

    act(() => {
      socket.triggerMessage({
        type: "PATIENT_CONNECTED",
        patientId: "p1",
        nickname: "Jane",
        connectedAt: 1000,
        values: {},
      });
      socket.triggerMessage({
        type: "PATIENT_FIELD_FOCUS",
        patientId: "p1",
        field: "email",
      });
    });
    expect(result.current.patients[0].focusedField).toBe("email");

    act(() => {
      socket.triggerMessage({ type: "PATIENT_FIELD_BLUR", patientId: "p1" });
    });
    expect(result.current.patients[0].focusedField).toBeUndefined();
  });

  it("applies field updates via updatePatientValue on PATIENT_FIELD_UPDATE", () => {
    const { result, socket } = setup();

    act(() => {
      socket.triggerMessage({
        type: "PATIENT_CONNECTED",
        patientId: "p1",
        nickname: "Jane",
        connectedAt: 1000,
        values: { firstname: "" },
      });
      socket.triggerMessage({
        type: "PATIENT_FIELD_UPDATE",
        patientId: "p1",
        field: "firstname",
        value: "John",
      });
    });

    expect(result.current.patients[0].values.firstname).toBe("John");
  });

  it("marks an existing patient as submitted on PATIENT_SUBMITTED", () => {
    const { result, socket } = setup();

    act(() => {
      socket.triggerMessage({
        type: "PATIENT_CONNECTED",
        patientId: "p1",
        nickname: "Jane",
        connectedAt: 1000,
        values: { firstname: "Jane" },
      });
      socket.triggerMessage({
        type: "PATIENT_SUBMITTED",
        patientId: "p1",
        nickname: "Jane",
        connectedAt: 1000,
        values: { firstname: "Jane" },
      });
    });

    expect(result.current.patients).toHaveLength(1);
    expect(result.current.patients[0].status).toBe("submitted");
  });

  it("adds a submitted patient not already in state on PATIENT_SUBMITTED", () => {
    const { result, socket } = setup();

    act(() => {
      socket.triggerMessage({
        type: "PATIENT_SUBMITTED",
        patientId: "p1",
        nickname: "Jane",
        connectedAt: 1000,
        values: { firstname: "Jane" },
      });
    });

    expect(result.current.patients).toHaveLength(1);
    expect(result.current.patients[0].status).toBe("submitted");
  });

  it("removes patient and clears selection on PATIENT_EXPIRED", () => {
    const { result, socket, setSelectedPatientId } = setup();

    act(() => {
      socket.triggerMessage({
        type: "PATIENT_SUBMITTED",
        patientId: "p1",
        nickname: "Jane",
        connectedAt: 1000,
        values: {},
      });
      socket.triggerMessage({ type: "PATIENT_EXPIRED", patientId: "p1" });
    });

    expect(result.current.patients).toHaveLength(0);
    expect(setSelectedPatientId).toHaveBeenCalled();
  });

  describe("PATIENT_DISCONNECTED", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("marks patient as disconnected immediately, then removes after 10s", () => {
      const { result, socket, setSelectedPatientId } = setup();

      act(() => {
        socket.triggerMessage({
          type: "PATIENT_CONNECTED",
          patientId: "p1",
          nickname: "Jane",
          connectedAt: 1000,
          values: {},
        });
        socket.triggerMessage({
          type: "PATIENT_DISCONNECTED",
          patientId: "p1",
          nickname: "Jane",
        });
      });

      expect(result.current.patients[0].status).toBe("disconnected");
      expect(result.current.patients).toHaveLength(1);

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(result.current.patients).toHaveLength(0);
      expect(setSelectedPatientId).toHaveBeenCalled();
    });

    it("does not remove the patient before the 10s grace period elapses", () => {
      const { result, socket } = setup();

      act(() => {
        socket.triggerMessage({
          type: "PATIENT_CONNECTED",
          patientId: "p1",
          nickname: "Jane",
          connectedAt: 1000,
          values: {},
        });
        socket.triggerMessage({
          type: "PATIENT_DISCONNECTED",
          patientId: "p1",
          nickname: "Jane",
        });
      });

      act(() => {
        jest.advanceTimersByTime(9000);
      });

      expect(result.current.patients).toHaveLength(1);
      expect(result.current.patients[0].status).toBe("disconnected");
    });
  });

  it("closes the socket on unmount", () => {
    const setSelectedPatientId = jest.fn();
    const { unmount } = renderHook(() =>
      useStaffRealtime({ setSelectedPatientId }),
    );
    const socket = getLastSocket();

    act(() => {
      socket.triggerOpen();
    });

    unmount();

    expect(socket.closed).toBe(true);
  });
});