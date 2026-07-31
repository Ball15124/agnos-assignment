import { z } from "zod";

export const patientSchema = z.object({
  firstname: z.string().trim().min(1, "Please enter first name"),
  middlename: z.string().trim().optional(),
  lastname: z.string().trim().min(1, "Please enter last name"),
  dateOfBirth: z.string().trim().min(1, "Please enter date of birth"),
  gender: z.enum(["Male", "Female"]),
  phoneNumber: z.string().trim().min(1, "Please enter phone number"),
  email: z.email("Please enter a valid email address"),
  address: z.string().trim().min(1, "Please enter address"),
  preferredLanguage: z
    .string()
    .trim()
    .min(1, "Please enter preferred language"),
  nationality: z.string().trim().min(1, "Please enter nationality"),
  emergencyContact: z
    .object({
      name: z.string().trim().optional(),
      relationship: z.string().optional(),
    })
    .optional(),
  religion: z.string().trim().optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
