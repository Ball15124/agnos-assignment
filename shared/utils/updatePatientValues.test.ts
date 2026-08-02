// shared/utils/updatePatientValues.test.ts
import { updatePatientValue } from "./updatePatientValues";
import { Patient } from "@/features/patient/types/patient.type";

const baseValues: Patient["values"] = {
  firstname: "John",
  middlename: "",
  lastname: "Doe",
  dateOfBirth: "1990-01-01",
  gender: "Male",
  phoneNumber: "1234567890",
  email: "john@example.com",
  address: "123 Main St",
  preferredLanguage: "English",
  nationality: "American",
  religion: "",
  emergencyContact: {
    name: "Jane Doe",
    relationship: "Spouse",
  },
};

describe("updatePatientValue", () => {
  it("updates a top-level field and leaves the rest unchanged", () => {
    const result = updatePatientValue(baseValues, "firstname", "Michael");

    expect(result.firstname).toBe("Michael");
    expect(result.lastname).toBe(baseValues.lastname);
    expect(result.email).toBe(baseValues.email);
  });

  it("does not mutate the original values object", () => {
    const original = { ...baseValues };
    updatePatientValue(baseValues, "firstname", "Michael");

    expect(baseValues).toEqual(original);
  });

  it("returns a new object reference, not the same one", () => {
    const result = updatePatientValue(baseValues, "firstname", "Michael");

    expect(result).not.toBe(baseValues);
  });

  it("updates emergencyContact.name without affecting emergencyContact.relationship", () => {
    const result = updatePatientValue(
      baseValues,
      "emergencyContact.name",
      "John Smith",
    );

    expect(result.emergencyContact?.name).toBe("John Smith");
    expect(result.emergencyContact?.relationship).toBe(
      baseValues.emergencyContact?.relationship,
    );
  });

  it("updates emergencyContact.relationship without affecting emergencyContact.name", () => {
    const result = updatePatientValue(
      baseValues,
      "emergencyContact.relationship",
      "Sibling",
    );

    expect(result.emergencyContact?.relationship).toBe("Sibling");
    expect(result.emergencyContact?.name).toBe(baseValues.emergencyContact?.name);
  });

  it("does not mutate the original nested emergencyContact object", () => {
    const originalEmergencyContact = { ...baseValues.emergencyContact };
    updatePatientValue(baseValues, "emergencyContact.name", "New Name");

    expect(baseValues.emergencyContact).toEqual(originalEmergencyContact);
  });

  it("returns a new emergencyContact object reference on nested update", () => {
    const result = updatePatientValue(
      baseValues,
      "emergencyContact.name",
      "New Name",
    );

    expect(result.emergencyContact).not.toBe(baseValues.emergencyContact);
  });

  it("sets an empty string value correctly", () => {
    const result = updatePatientValue(baseValues, "firstname", "");

    expect(result.firstname).toBe("");
  });

  it("does not affect other unrelated fields when updating a field repeatedly", () => {
    let result = updatePatientValue(baseValues, "firstname", "A");
    result = updatePatientValue(result, "firstname", "AB");
    result = updatePatientValue(result, "firstname", "ABC");

    expect(result.firstname).toBe("ABC");
    expect(result.lastname).toBe(baseValues.lastname);
  });
});