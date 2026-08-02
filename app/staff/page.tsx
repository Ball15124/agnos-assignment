"use client";
import BackButton from "@/components/backButton";
import PatientForm from "@/features/patient/components/patientForm";
import PatientTable from "@/features/staff/components/patientTable";
import useStaffRealtime from "@/features/staff/hooks/useStaffRealtime";
import { getStatusColor } from "@/features/staff/utils/staffHelper";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const StaffPage = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );
  const { patients, loading } = useStaffRealtime({ setSelectedPatientId });
  const router = useRouter();
  const patient = patients.find((patient) => patient.id === selectedPatientId);
  const sortedPatients = [...patients].sort(
    (a, b) => b.connectedAt - a.connectedAt,
  );
  const indicator = ["active", "idle", "submitted", "disconnected"] as const;

  return (
    <div className="flex flex-col h-full md:flex-row relative overflow-hidden">
      <div
        className={`flex flex-col py-6 h-full min-h-0 transition-all duration-300 ${
          selectedPatientId ? "w-full md:w-[50%]" : "w-full"
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col px-6 overflow-hidden h-full min-h-0">
          <div className="w-full">
            <BackButton onClick={() => router.push("/")} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary text-center">
            Staff View
          </h1>
          <p className="text-center text-gray-600 text-sm sm:text-base">
            Welcome to the staff view. Here you can manage patient data and
            monitor their information using the color indicators below.
          </p>
          <div className="flex gap-4 flex-wrap w-full justify-center mt-2 mb-10">
            {indicator.map((status) => (
              <div key={status} className="flex gap-2 items-center capitalize">
                <div
                  className={`h-2 w-2 rounded-full ${getStatusColor(status)}`}
                />
                {status}
              </div>
            ))}
          </div>
          <PatientTable
            patients={sortedPatients}
            loading={loading}
            onSelectPatientId={setSelectedPatientId}
            selectedPatientId={selectedPatientId ?? undefined}
          />
        </div>
      </div>

      <div
        onClick={() => setSelectedPatientId(null)}
        className={`fixed inset-0 z-10 bg-black/30 transition-opacity duration-300 md:hidden ${
          selectedPatientId && patient
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-20 flex h-[85vh] min-h-0 flex-col overflow-hidden rounded-t-2xl px-2 pt-6 pb-10 bg-white shadow-2xl transition-transform duration-300 ease-in-out
  md:static md:z-auto md:h-full md:w-0 md:shrink-0 md:rounded-2xl md:bg-transparent md:shadow-none md:transition-all md:border md:border-gray-200
  ${
    selectedPatientId && patient
      ? "translate-y-0 md:w-[50%] md:opacity-100 md:translate-y-0"
      : "translate-y-full md:w-0 md:opacity-0 md:translate-y-0"
  }`}
      >
        {patient && (
          <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col">
            <div className="flex justify-between px-4 gap-2">
              <div className="flex flex-col min-w-0">
                <p className="text-sm">ID: {patient.id}</p>
                <div className="flex items-center gap-2 capitalize text-sm">
                  STATUS:
                  <div
                    className={`h-2 w-2 rounded-full ${getStatusColor(patient.status)}`}
                  />
                  {patient.status}
                </div>

                <h1 className="text-3xl font-bold text-primary truncate">
                  Patient: {patient.nickname}
                </h1>
              </div>
              <div
                onClick={() => setSelectedPatientId(null)}
                className="cursor-pointer shrink-0 text-gray-400"
              >
                <X />
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
              <PatientForm
                readOnly={true}
                realTimeUpdate={patient.values}
                focusField={patient.focusedField}
                isPatientSubmitted={patient.status === "submitted"}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffPage;
