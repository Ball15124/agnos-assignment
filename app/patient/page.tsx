"use client";
import dynamic from "next/dynamic";
import PatientForm from "@/features/patient/components/patientForm";
import { useEffect, useState } from "react";
import CustomDialog from "@/components/customDialog";
import BackButton from "@/components/backButton";
import usePatientRealtime from "@/features/patient/hooks/usePatientRealtime";
import { useRouter } from "next/navigation";
const PatientIdentityDialog = dynamic(
  () => import("@/features/patient/components/patientIdentityDialog"),
  {
    ssr: false,
  },
);

const PatientPage = () => {
  const [nickname, setNickname] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {
    patientId,
    handleFormActivity,
    handleFieldFocus,
    handleFieldBlur,
    handleFormSubmit,
  } = usePatientRealtime(nickname);

  const handleNicknameSubmit = (nickname: string) => {
    setNickname(nickname);
  };

  const handleSubmit = () => {
    if (!patientId) return;

    setOpen(true);
    handleFormSubmit();
  };

  const handleBackButton = () => {
    if (isDirty) {
      setShowLeaveDialog(true);
      return;
    }

    router.push("/");
  };

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  return (
    <div className="flex flex-col items-center py-6">
      <div className="flex flex-col items-center w-full max-w-3xl">
        <div className="w-full">
          <BackButton onClick={handleBackButton} />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-primary text-center">
          Patient Form
        </h1>
        <p className="text-gray-600 text-center">
          Welcome to the patient form. Here you can input your information.
        </p>

        <PatientForm
          onFormActivity={handleFormActivity}
          onSubmit={handleSubmit}
          onFocus={handleFieldFocus}
          onBlur={handleFieldBlur}
          onDirtyChange={setIsDirty}
        />
      </div>
      {!nickname && <PatientIdentityDialog onSubmit={handleNicknameSubmit} />}
      {open && (
        <CustomDialog
          onClose={() => setOpen(false)}
          title="Thank you!"
          description="Your information has been submitted successfully."
          theme="dialog_success"
        />
      )}
      {showLeaveDialog && (
        <CustomDialog
          title="Leave this page?"
          description="Your entered information will be lost if you leave."
          theme="dialog_warning"
          onClose={() => setShowLeaveDialog(false)}
          onConfirm={() => {
            setShowLeaveDialog(false);
            router.push("/");
          }}
        />
      )}
    </div>
  );
};

export default PatientPage;
