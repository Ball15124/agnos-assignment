import { Patient } from "@/features/patient/types/patient.type";

export const updatePatientValue = (
  values: Patient["values"],
  field: string,
  value: string,
): Patient["values"] => {
  if (field === "emergencyContact.name") {
    return {
      ...values,
      emergencyContact: {
        ...values.emergencyContact,
        name: value,
      },
    };
  }

  if (field === "emergencyContact.relationship") {
    return {
      ...values,
      emergencyContact: {
        ...values.emergencyContact,
        relationship: value,
      },
    };
  }

  return {
    ...values,
    [field]: value,
  };
};