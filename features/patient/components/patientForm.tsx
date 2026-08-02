"use client";
import { Controller, useForm } from "react-hook-form";
import {
  PatientFormData,
  PatientFormInput,
  patientSchema,
} from "../schemas/patient.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/components/customInput";
import {
  GENDER_OPTIONS,
  LANGUAGE_OPTIONS,
  NATIONALITY_OPTIONS,
  RELIGION_OPTIONS,
} from "../constants/patient.options";
import CustomSelect from "@/components/customSelect";
import { useEffect, useState } from "react";
import { Patient, PatientField } from "../types/patient.type";

interface PatientFormProps {
  onFormActivity?: (field: PatientField, value: string) => void;
  onSubmit?: () => void;
  readOnly?: boolean;
  realTimeUpdate?: Patient["values"];
  focusField?: PatientField;
  onFocus?: (field: PatientField) => void;
  onBlur?: (field: PatientField) => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

const PatientForm = ({
  onFormActivity,
  onSubmit,
  readOnly,
  realTimeUpdate,
  focusField,
  onFocus,
  onBlur,
  onDirtyChange,
}: PatientFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const patientForm = useForm<PatientFormInput, unknown, PatientFormData>({
    mode: "onSubmit",
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstname: "",
      middlename: "",
      lastname: "",
      dateOfBirth: "",
      gender: "",
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

  const handleFormSubmit = (data: PatientFormData) => {
    console.log("Form submitted:", data);
    setIsSubmitted(true);
    patientForm.reset(data);
    onSubmit?.();
  };

  useEffect(() => {
    onDirtyChange?.(patientForm.formState.isDirty);
  }, [patientForm.formState.isDirty, onDirtyChange]);

  return (
    <form
      onSubmit={patientForm.handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-2 w-full"
    >
      <Controller
        name="firstname"
        control={patientForm.control}
        render={({ field }) => (
          <CustomInput
            id="firstname"
            label="First Name"
            value={readOnly ? (realTimeUpdate?.firstname ?? "") : field.value}
            onChange={(e) => {
              field.onChange(e);
              onFormActivity?.("firstname", e.target.value);
            }}
            onFocus={() => onFocus?.("firstname")}
            onBlur={() => {
              field.onBlur();
              onBlur?.("firstname");
            }}
            error={patientForm.formState.errors.firstname?.message}
            isRequired
            disabled={isSubmitted || readOnly}
            remoteFocus={focusField === "firstname"}
          />
        )}
      />

      <Controller
        name="middlename"
        control={patientForm.control}
        render={({ field }) => (
          <CustomInput
            id="middlename"
            label="Middle Name"
            value={readOnly ? (realTimeUpdate?.middlename ?? "") : field.value}
            onChange={(e) => {
              field.onChange(e);
              onFormActivity?.("middlename", e.target.value);
            }}
            onFocus={() => onFocus?.("middlename")}
            onBlur={() => {
              field.onBlur();
              onBlur?.("middlename");
            }}
            error={patientForm.formState.errors.middlename?.message}
            disabled={isSubmitted || readOnly}
            remoteFocus={focusField === "middlename"}
          />
        )}
      />

      <Controller
        name="lastname"
        control={patientForm.control}
        render={({ field }) => (
          <CustomInput
            id="lastname"
            label="Last Name"
            value={readOnly ? (realTimeUpdate?.lastname ?? "") : field.value}
            onChange={(e) => {
              field.onChange(e);
              onFormActivity?.("lastname", e.target.value);
            }}
            onFocus={() => onFocus?.("lastname")}
            onBlur={() => {
              field.onBlur();
              onBlur?.("lastname");
            }}
            error={patientForm.formState.errors.lastname?.message}
            isRequired
            disabled={isSubmitted || readOnly}
            remoteFocus={focusField === "lastname"}
          />
        )}
      />

      <Controller
        name="dateOfBirth"
        control={patientForm.control}
        render={({ field }) => (
          <CustomInput
            id="dateOfBirth"
            label="Date of Birth"
            type="date"
            value={readOnly ? (realTimeUpdate?.dateOfBirth ?? "") : field.value}
            onChange={(e) => {
              field.onChange(e);
              onFormActivity?.("dateOfBirth", e.target.value);
            }}
            onFocus={() => onFocus?.("dateOfBirth")}
            onBlur={() => {
              field.onBlur();
              onBlur?.("dateOfBirth");
            }}
            error={patientForm.formState.errors.dateOfBirth?.message}
            isRequired
            disabled={isSubmitted || readOnly}
            remoteFocus={focusField === "dateOfBirth"}
          />
        )}
      />

      <Controller
        name="gender"
        control={patientForm.control}
        render={({ field }) => (
          <CustomSelect
            id="gender"
            label="Gender"
            options={GENDER_OPTIONS}
            value={readOnly ? (realTimeUpdate?.gender ?? "") : field.value}
            onChange={(e) => {
              field.onChange(e);
              onFormActivity?.("gender", e.target.value);
            }}
            onFocus={() => onFocus?.("gender")}
            onBlur={() => {
              field.onBlur();
              onBlur?.("gender");
            }}
            error={patientForm.formState.errors.gender?.message}
            isRequired
            disabled={isSubmitted || readOnly}
            remoteFocus={focusField === "gender"}
          />
        )}
      />

      <Controller
        name="phoneNumber"
        control={patientForm.control}
        render={({ field }) => (
          <CustomInput
            id="phoneNumber"
            label="Phone Number"
            value={readOnly ? (realTimeUpdate?.phoneNumber ?? "") : field.value}
            onChange={(e) => {
              field.onChange(e);
              onFormActivity?.("phoneNumber", e.target.value);
            }}
            onFocus={() => onFocus?.("phoneNumber")}
            onBlur={() => {
              field.onBlur();
              onBlur?.("phoneNumber");
            }}
            error={patientForm.formState.errors.phoneNumber?.message}
            isRequired
            disabled={isSubmitted || readOnly}
            remoteFocus={focusField === "phoneNumber"}
          />
        )}
      />

      <Controller
        name="email"
        control={patientForm.control}
        render={({ field }) => (
          <CustomInput
            id="email"
            label="Email"
            value={readOnly ? (realTimeUpdate?.email ?? "") : field.value}
            onChange={(e) => {
              field.onChange(e);
              onFormActivity?.("email", e.target.value);
            }}
            onFocus={() => onFocus?.("email")}
            onBlur={() => {
              field.onBlur();
              onBlur?.("email");
            }}
            error={patientForm.formState.errors.email?.message}
            isRequired
            disabled={isSubmitted || readOnly}
            remoteFocus={focusField === "email"}
          />
        )}
      />

      <Controller
        name="address"
        control={patientForm.control}
        render={({ field }) => (
          <CustomInput
            id="address"
            label="Address"
            value={readOnly ? (realTimeUpdate?.address ?? "") : field.value}
            onChange={(e) => {
              field.onChange(e);
              onFormActivity?.("address", e.target.value);
            }}
            onFocus={() => onFocus?.("address")}
            onBlur={() => {
              field.onBlur();
              onBlur?.("address");
            }}
            error={patientForm.formState.errors.address?.message}
            isRequired
            disabled={isSubmitted || readOnly}
            remoteFocus={focusField === "address"}
          />
        )}
      />

      <Controller
        name="preferredLanguage"
        control={patientForm.control}
        render={({ field }) => (
          <CustomSelect
            id="preferredLanguage"
            label="Preferred Language"
            options={LANGUAGE_OPTIONS}
            value={
              readOnly ? (realTimeUpdate?.preferredLanguage ?? "") : field.value
            }
            onChange={(e) => {
              field.onChange(e);
              onFormActivity?.("preferredLanguage", e.target.value);
            }}
            onFocus={() => onFocus?.("preferredLanguage")}
            onBlur={() => {
              field.onBlur();
              onBlur?.("preferredLanguage");
            }}
            error={patientForm.formState.errors.preferredLanguage?.message}
            isRequired
            disabled={isSubmitted || readOnly}
            remoteFocus={focusField === "preferredLanguage"}
          />
        )}
      />

      <Controller
        name="nationality"
        control={patientForm.control}
        render={({ field }) => (
          <CustomSelect
            id="nationality"
            label="Nationality"
            options={NATIONALITY_OPTIONS}
            value={readOnly ? (realTimeUpdate?.nationality ?? "") : field.value}
            onChange={(e) => {
              field.onChange(e);
              onFormActivity?.("nationality", e.target.value);
            }}
            onFocus={() => onFocus?.("nationality")}
            onBlur={() => {
              field.onBlur();
              onBlur?.("nationality");
            }}
            error={patientForm.formState.errors.nationality?.message}
            isRequired
            disabled={isSubmitted || readOnly}
            remoteFocus={focusField === "nationality"}
          />
        )}
      />

      <div className="flex flex-col w-full">
        <label
          htmlFor="emergencyContactName"
          className="block text-sm font-medium text-gray-700"
        >
          Emergency Contact
        </label>
        <div className="flex flex-col md:flex-row gap-2">
          <Controller
            name="emergencyContact.name"
            control={patientForm.control}
            render={({ field }) => (
              <CustomInput
                id="emergencyContactName"
                placeholder="Name"
                value={
                  readOnly
                    ? (realTimeUpdate?.emergencyContact?.name ?? "")
                    : field.value
                }
                onChange={(e) => {
                  field.onChange(e);
                  onFormActivity?.("emergencyContact.name", e.target.value);
                }}
                onFocus={() => onFocus?.("emergencyContact.name")}
                onBlur={() => {
                  field.onBlur();
                  onBlur?.("emergencyContact.name");
                }}
                error={
                  patientForm.formState.errors.emergencyContact?.name?.message
                }
                disabled={isSubmitted || readOnly}
                remoteFocus={focusField === "emergencyContact.name"}
              />
            )}
          />

          <Controller
            name="emergencyContact.relationship"
            control={patientForm.control}
            render={({ field }) => (
              <CustomInput
                id="emergencyContactRelationship"
                placeholder="Relationship"
                value={
                  readOnly
                    ? (realTimeUpdate?.emergencyContact?.relationship ?? "")
                    : field.value
                }
                onChange={(e) => {
                  field.onChange(e);
                  onFormActivity?.(
                    "emergencyContact.relationship",
                    e.target.value,
                  );
                }}
                onFocus={() => onFocus?.("emergencyContact.relationship")}
                onBlur={() => {
                  field.onBlur();
                  onBlur?.("emergencyContact.relationship");
                }}
                error={
                  patientForm.formState.errors.emergencyContact?.relationship
                    ?.message
                }
                disabled={isSubmitted || readOnly}
                remoteFocus={focusField === "emergencyContact.relationship"}
              />
            )}
          />
        </div>
      </div>

      <Controller
        name="religion"
        control={patientForm.control}
        render={({ field }) => (
          <CustomSelect
            id="religion"
            label="Religion"
            options={RELIGION_OPTIONS}
            value={readOnly ? (realTimeUpdate?.religion ?? "") : field.value}
            onChange={(e) => {
              field.onChange(e);
              onFormActivity?.("religion", e.target.value);
            }}
            onFocus={() => onFocus?.("religion")}
            onBlur={() => {
              field.onBlur();
              onBlur?.("religion");
            }}
            error={patientForm.formState.errors.religion?.message}
            disabled={isSubmitted || readOnly}
            remoteFocus={focusField === "religion"}
          />
        )}
      />
      {!readOnly && (
        <button
          type="submit"
          className="bg-primary text-white py-2 px-4 rounded-md mt-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitted}
        >
          Submit
        </button>
      )}
    </form>
  );
};

export default PatientForm;
