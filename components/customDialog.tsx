"use client";

import { AlertTriangle, Check, X } from "lucide-react";

export const DIALOG_THEME = {
  SUCCESS: "dialog_success",
  WARNING: "dialog_warning",
} as const;

type DialogTheme = (typeof DIALOG_THEME)[keyof typeof DIALOG_THEME];

interface CustomDialogProps {
  onConfirm?: () => void;
  onClose?: () => void;
  title: string;
  description?: string;
  theme: DialogTheme;
}

const CustomDialog = ({
  onConfirm,
  onClose,
  title,
  description,
  theme,
}: CustomDialogProps) => {
  const isSuccess = theme === DIALOG_THEME.SUCCESS;

  const Icon = isSuccess ? Check : AlertTriangle;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="flex relative w-full max-w-md flex-col items-center justify-center rounded-xl bg-white p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <X className="absolute top-2 right-4 text-gray-400 cursor-pointer" onClick={onClose}/>
        <div
          className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            isSuccess ? "bg-green-100" : "bg-yellow-100"
          }`}
        >
          <Icon
            className={`h-10 w-10 ${
              isSuccess ? "text-green-600" : "text-yellow-600"
            }`}
          />
        </div>

        <h2
          className={`text-2xl font-bold ${
            isSuccess ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        )}

        <div className="flex gap-2 items-center w-full">
          {!isSuccess && (
            <button
              type="button"
              className="mt-4 w-full cursor-pointer rounded-2xl bg-gray-200 px-4 py-2 font-medium"
              onClick={onClose}
            >
              Close
            </button>
          )}
          <button
            type="button"
            className="mt-4 w-full cursor-pointer rounded-2xl bg-primary px-4 py-2 font-medium text-white"
            onClick={onConfirm ?? onClose}
          >
            {isSuccess ? "Okay" : "Leave"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
