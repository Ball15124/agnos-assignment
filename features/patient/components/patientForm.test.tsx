// features/patient/components/patientForm.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PatientForm from "./patientForm";

describe("PatientForm", () => {
  it("renders all required fields", () => {
    render(<PatientForm />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred language/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nationality/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    render(<PatientForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/please enter first name/i),
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/please enter last name/i)).toBeInTheDocument();
    expect(screen.getByText(/please select gender/i)).toBeInTheDocument();
  });

  it("calls onFormActivity with field name and value when typing", async () => {
    const user = userEvent.setup();
    const onFormActivity = jest.fn();
    render(<PatientForm onFormActivity={onFormActivity} />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.type(firstNameInput, "J");

    expect(onFormActivity).toHaveBeenCalledWith("firstname", "J");
  });

  it("calls onFocus and onBlur with the field name", async () => {
    const user = userEvent.setup();
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    render(<PatientForm onFocus={onFocus} onBlur={onBlur} />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.click(firstNameInput);
    expect(onFocus).toHaveBeenCalledWith("firstname");

    await user.tab();
    expect(onBlur).toHaveBeenCalledWith("firstname");
  });

  it("calls onDirtyChange(true) once the form has been edited", async () => {
    const user = userEvent.setup();
    const onDirtyChange = jest.fn();
    render(<PatientForm onDirtyChange={onDirtyChange} />);

    expect(onDirtyChange).toHaveBeenCalledWith(false);

    await user.type(screen.getByLabelText(/first name/i), "J");

    await waitFor(() => {
      expect(onDirtyChange).toHaveBeenCalledWith(true);
    });
  });

  it("submits successfully with valid data and calls onSubmit", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<PatientForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/date of birth/i), "1990-01-01");
    await user.selectOptions(screen.getByLabelText(/gender/i), "Male");
    await user.type(screen.getByLabelText(/phone number/i), "+1234567890");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/address/i), "123 Main St");
    await user.selectOptions(
      screen.getByLabelText(/preferred language/i),
      screen.getAllByRole("option", { name: /./ })[1] // pick any non-empty option
        ? (screen.getByLabelText(/preferred language/i) as HTMLSelectElement)
            .options[1].value
        : "",
    );
    await user.selectOptions(
      screen.getByLabelText(/nationality/i),
      (screen.getByLabelText(/nationality/i) as HTMLSelectElement).options[1]
        .value,
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it("disables the submit button after successful submission", async () => {
    const user = userEvent.setup();
    render(<PatientForm />);

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/date of birth/i), "1990-01-01");
    await user.selectOptions(screen.getByLabelText(/gender/i), "Male");
    await user.type(screen.getByLabelText(/phone number/i), "+1234567890");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/address/i), "123 Main St");
    await user.selectOptions(
      screen.getByLabelText(/preferred language/i),
      (screen.getByLabelText(/preferred language/i) as HTMLSelectElement)
        .options[1].value,
    );
    await user.selectOptions(
      screen.getByLabelText(/nationality/i),
      (screen.getByLabelText(/nationality/i) as HTMLSelectElement).options[1]
        .value,
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
    });
  });

  it("does not render the submit button in readOnly mode", () => {
    render(<PatientForm readOnly />);

    expect(
      screen.queryByRole("button", { name: /submit/i }),
    ).not.toBeInTheDocument();
  });

  it("displays realTimeUpdate values instead of local input in readOnly mode", () => {
    render(
      <PatientForm
        readOnly
        realTimeUpdate={{
          firstname: "Jane",
          middlename: "",
          lastname: "Smith",
          dateOfBirth: "1985-05-05",
          gender: "Female",
          phoneNumber: "0987654321",
          email: "jane@example.com",
          address: "456 Side St",
          preferredLanguage: "",
          nationality: "",
          religion: "",
          emergencyContact: { name: "", relationship: "" },
        }}
      />,
    );

    expect(screen.getByLabelText(/first name/i)).toHaveValue("Jane");
    expect(screen.getByLabelText(/last name/i)).toHaveValue("Smith");
    expect(screen.getByLabelText(/email/i)).toHaveValue("jane@example.com");
  });

  it("disables all fields in readOnly mode", () => {
    render(<PatientForm readOnly />);

    expect(screen.getByLabelText(/first name/i)).toBeDisabled();
    expect(screen.getByLabelText(/last name/i)).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
  });
});