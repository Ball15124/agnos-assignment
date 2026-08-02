// features/patient/schemas/patient.schema.test.ts
import { patientSchema } from "./patient.schema";

const validPatient = {
  firstname: "John",
  middlename: "Michael",
  lastname: "Doe",
  dateOfBirth: "1990-01-01",
  gender: "Male",
  phoneNumber: "+1 234-567-8900",
  email: "john.doe@example.com",
  address: "123 Main St",
  preferredLanguage: "English",
  nationality: "American",
  emergencyContact: {
    name: "Jane Doe",
    relationship: "Spouse",
  },
  religion: "None",
};

describe("patientSchema", () => {
  it("accepts a fully valid patient object", () => {
    const result = patientSchema.safeParse(validPatient);
    expect(result.success).toBe(true);
  });

  it("accepts a patient with only required fields (all optional fields omitted)", () => {
    const { middlename, emergencyContact, religion, ...required } =
      validPatient;

    const result = patientSchema.safeParse(required);
    expect(result.success).toBe(true);
  });

  describe("firstname", () => {
    it("rejects an empty string", () => {
      const result = patientSchema.safeParse({ ...validPatient, firstname: "" });
      expect(result.success).toBe(false);
    });

    it("rejects a whitespace-only string", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        firstname: "   ",
      });
      expect(result.success).toBe(false);
    });

    it("trims surrounding whitespace on a valid value", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        firstname: "  John  ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstname).toBe("John");
      }
    });
  });

  describe("middlename", () => {
    it("is optional and can be omitted", () => {
      const { middlename, ...rest } = validPatient;
      const result = patientSchema.safeParse(rest);
      expect(result.success).toBe(true);
    });

    it("accepts an empty string since it is optional", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        middlename: "",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("lastname", () => {
    it("rejects an empty string", () => {
      const result = patientSchema.safeParse({ ...validPatient, lastname: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("dateOfBirth", () => {
    it("rejects an empty string", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        dateOfBirth: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("gender", () => {
    it("accepts Male", () => {
      const result = patientSchema.safeParse({ ...validPatient, gender: "Male" });
      expect(result.success).toBe(true);
    });

    it("accepts Female", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        gender: "Female",
      });
      expect(result.success).toBe(true);
    });

    it("rejects an empty string", () => {
      const result = patientSchema.safeParse({ ...validPatient, gender: "" });
      expect(result.success).toBe(false);
    });

    it("rejects a value outside the enum", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        gender: "Other",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("phoneNumber", () => {
    it("rejects a number shorter than 7 characters", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        phoneNumber: "12345",
      });
      expect(result.success).toBe(false);
    });

    it("rejects a number longer than 20 characters", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        phoneNumber: "1".repeat(21),
      });
      expect(result.success).toBe(false);
    });

    it("rejects letters or invalid characters", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        phoneNumber: "123-abc-4567",
      });
      expect(result.success).toBe(false);
    });

    it("accepts digits, +, -, (), and spaces", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        phoneNumber: "+66 (02) 123-4567",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("email", () => {
    it("rejects an invalid email format", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        email: "not-an-email",
      });
      expect(result.success).toBe(false);
    });

    it("accepts a valid email", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        email: "test@example.com",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("address", () => {
    it("rejects an empty string", () => {
      const result = patientSchema.safeParse({ ...validPatient, address: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("preferredLanguage", () => {
    it("rejects an empty string", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        preferredLanguage: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("nationality", () => {
    it("rejects an empty string", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        nationality: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("emergencyContact", () => {
    it("is optional and can be omitted entirely", () => {
      const { emergencyContact, ...rest } = validPatient;
      const result = patientSchema.safeParse(rest);
      expect(result.success).toBe(true);
    });

    it("accepts an object with only name provided", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        emergencyContact: { name: "Jane Doe" },
      });
      expect(result.success).toBe(true);
    });

    it("accepts an empty object since both nested fields are optional", () => {
      const result = patientSchema.safeParse({
        ...validPatient,
        emergencyContact: {},
      });
      expect(result.success).toBe(true);
    });
  });

  describe("religion", () => {
    it("is optional and can be omitted", () => {
      const { religion, ...rest } = validPatient;
      const result = patientSchema.safeParse(rest);
      expect(result.success).toBe(true);
    });
  });

  it("returns errors for multiple invalid fields at once", () => {
    const result = patientSchema.safeParse({
      ...validPatient,
      firstname: "",
      lastname: "",
      email: "invalid",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path[0]);
      expect(paths).toEqual(
        expect.arrayContaining(["firstname", "lastname", "email"]),
      );
    }
  });
});