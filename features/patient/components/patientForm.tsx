"use client";
import { useForm } from "react-hook-form";
import { PatientFormData, patientSchema } from "../schemas/patient.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/components/customInput";
import { GENDER_OPTIONS } from "../constants/patient.options";

const PatientForm = () => {
  const patientForm = useForm<PatientFormData>({
    mode: "onSubmit",
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstname: "",
      middlename: "",
      lastname: "",
      dateOfBirth: "",
      gender: undefined,
      phoneNumber: "",
      email: "",
      address: "",
      preferredLanguage: "",
      nationality: "",
      emergencyContact: {
        name: "",
        relationship: "",
      },
      religion: "",
    },
  });

  return (
    <form
      onSubmit={patientForm.handleSubmit((data) => console.log(data))}
      className="flex flex-col gap-2 w-full"
    >
      <CustomInput
        id="firstname"
        label="First Name"
        {...patientForm.register("firstname")}
        error={patientForm.formState.errors.firstname?.message}
      />

      <CustomInput
        id="middlename"
        label="Middle Name"
        {...patientForm.register("middlename")}
        error={patientForm.formState.errors.middlename?.message}
      />

      <CustomInput
        id="lastname"
        label="Last Name"
        {...patientForm.register("lastname")}
        error={patientForm.formState.errors.lastname?.message}
      />

      <CustomInput
        id="dateOfBirth"
        label="Date of Birth"
        type="date"
        {...patientForm.register("dateOfBirth")}
        error={patientForm.formState.errors.dateOfBirth?.message}
      />

      <label htmlFor="gender">Gender</label>
      <div className="relative w-full">
        <select
          {...patientForm.register("gender")}
          className="w-full appearance-none rounded-md border border-gray-300 py-2 pl-3 pr-10 focus:ring-1 focus:ring-blue-700 focus:border-blue-700"
        >
          {GENDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          ▼
        </span>
      </div>

      <label htmlFor="phone">Phone Number</label>

      <CustomInput
        id="email"
        label="Email"
        {...patientForm.register("email")}
        error={patientForm.formState.errors.email?.message}
      />

      <CustomInput
        id="address"
        label="Address"
        {...patientForm.register("address")}
        error={patientForm.formState.errors.address?.message}
      />

      <label htmlFor="preferredLanguage">Preferred Language</label>

      <label htmlFor="nationality">Nationality</label>

      <label htmlFor="emergencyContactName">Emergency Contact</label>
      <div className="flex gap-x-2">
        <CustomInput
          id="emergencyContactName"
          placeholder="Name"
          {...patientForm.register("emergencyContact.name")}
          error={patientForm.formState.errors.emergencyContact?.name?.message}
        />

        <CustomInput
          id="emergencyContactRelationship"
          placeholder="Relationship"
          {...patientForm.register("emergencyContact.relationship")}
          error={
            patientForm.formState.errors.emergencyContact?.relationship?.message
          }
        />
      </div>
      <label htmlFor="religion">Religion</label>
    </form>
  );
};

export default PatientForm;
