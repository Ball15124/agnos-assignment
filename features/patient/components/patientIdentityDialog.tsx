"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface PatientIdentityDialogProps {
  onSubmit: (nickname: string) => void;
}

const PatientIdentityDialog = ({ onSubmit }: PatientIdentityDialogProps) => {
  const [nickname, setNickname] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = nickname.trim();

    if (!value) {
      return;
    }

    onSubmit(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold">What do we call you?</h2>

        <p className="mt-2 text-sm text-gray-600">
          Enter a name you&apos;d like us to use while completing the form.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Your name"
            autoFocus
            className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2 w-full">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-md w-full bg-gray-200 px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={nickname.trim().length === 0}
              className="rounded-md w-full bg-primary px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientIdentityDialog;
