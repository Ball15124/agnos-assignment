export interface Patient {
  id: string;
  status: "idle" | "active" | "submitted" | "disconnected";
  nickname: string;
  connectedAt: number;
  focusedField?: PatientField;
  values: {
    firstname: string;
    middlename: string;
    lastname: string;
    dateOfBirth: string;
    gender: "Male" | "Female" | "";
    phoneNumber: string;
    email: string;
    address: string;
    preferredLanguage: string;
    nationality: string;
    religion: string;
    emergencyContact: {
      name: string;
      relationship: string;
    };
  };
}

export type PatientField =
  | "firstname"
  | "middlename"
  | "lastname"
  | "dateOfBirth"
  | "gender"
  | "phoneNumber"
  | "email"
  | "address"
  | "preferredLanguage"
  | "nationality"
  | "emergencyContact.name"
  | "emergencyContact.relationship"
  | "religion";
