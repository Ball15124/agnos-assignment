// features/staff/components/patientTable.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PatientTable from "./patientTable";
import { Patient } from "@/features/patient/types/patient.type";

const makePatient = (overrides: Partial<Patient> = {}): Patient => ({
  id: "p1",
  status: "idle",
  nickname: "Jane",
  connectedAt: new Date(Date.UTC(2024, 2, 15, 9, 5, 30)).getTime(),
  values: {
    firstname: "Jane",
    middlename: "",
    lastname: "Doe",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    address: "",
    preferredLanguage: "",
    nationality: "",
    religion: "",
    emergencyContact: { name: "", relationship: "" },
  },
  ...overrides,
});

describe("PatientTable", () => {
  it("shows a loading message when loading is true and there are no patients", () => {
    render(<PatientTable patients={[]} loading={true} />);

    expect(screen.getByText(/loading patients/i)).toBeInTheDocument();
  });

  it("shows an empty state message when not loading and there are no patients", () => {
    render(<PatientTable patients={[]} loading={false} />);

    expect(
      screen.getByText(/there are no patients to display/i),
    ).toBeInTheDocument();
  });

  it("renders a row for each patient with status, nickname, and id", () => {
    const patients = [
      makePatient({ id: "p1", nickname: "Jane", status: "idle" }),
      makePatient({ id: "p2", nickname: "John", status: "active" }),
    ];

    render(<PatientTable patients={patients} loading={false} />);

    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("p1")).toBeInTheDocument();
    expect(screen.getByText("p2")).toBeInTheDocument();
    expect(screen.getByText("idle")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("renders the formatted connectedAt timestamp for each patient", () => {
    const patient = makePatient({
      connectedAt: new Date(Date.UTC(2024, 2, 15, 9, 5, 30)).getTime(),
    });

    render(<PatientTable patients={[patient]} loading={false} />);

    // Only assert the date portion since the time depends on the
    // test runner's local timezone (formatDateTime has no timeZone option).
    expect(screen.getByText(/15\/03\/2024/)).toBeInTheDocument();
  });

  it("calls onSelectPatientId with the patient id when a row is clicked", async () => {
    const user = userEvent.setup();
    const onSelectPatientId = jest.fn();
    const patient = makePatient({ id: "p1", nickname: "Jane" });

    render(
      <PatientTable
        patients={[patient]}
        loading={false}
        onSelectPatientId={onSelectPatientId}
      />,
    );

    await user.click(screen.getByText("Jane"));

    expect(onSelectPatientId).toHaveBeenCalledWith("p1");
  });

  it("calls onSelectPatientId with null when clicking an already-selected row", async () => {
    const user = userEvent.setup();
    const onSelectPatientId = jest.fn();
    const patient = makePatient({ id: "p1", nickname: "Jane" });

    render(
      <PatientTable
        patients={[patient]}
        loading={false}
        onSelectPatientId={onSelectPatientId}
        selectedPatientId="p1"
      />,
    );

    await user.click(screen.getByText("Jane"));

    expect(onSelectPatientId).toHaveBeenCalledWith(null);
  });

  it("does not throw when onSelectPatientId is not provided", async () => {
    const user = userEvent.setup();
    const patient = makePatient({ id: "p1", nickname: "Jane" });

    render(<PatientTable patients={[patient]} loading={false} />);

    await expect(user.click(screen.getByText("Jane"))).resolves.not.toThrow();
  });

  it("renders multiple patients in the order provided", () => {
    const patients = [
      makePatient({ id: "p1", nickname: "Alice" }),
      makePatient({ id: "p2", nickname: "Bob" }),
      makePatient({ id: "p3", nickname: "Carol" }),
    ];

    render(<PatientTable patients={patients} loading={false} />);

    const rows = screen.getAllByRole("row");
    // rows[0] is the header row
    expect(rows[1]).toHaveTextContent("Alice");
    expect(rows[2]).toHaveTextContent("Bob");
    expect(rows[3]).toHaveTextContent("Carol");
  });
});