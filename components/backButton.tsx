import { ArrowLeft } from "lucide-react";

const BackButton = ({
  onClick,
}: {
  onClick: () => void;
  isDirty?: boolean;
  setShowLeaveDialog?: (e: boolean) => void;
}) => {
  return (
    <button
      type="button"
      className="cursor-pointer w-fit group flex gap-2 items-center"
      onClick={() => {
        onClick?.();
      }}
    >
      <ArrowLeft className="shrink-0" />
      <div className="hidden md:block md:underline md:max-w-0 md:overflow-hidden md:whitespace-nowrap md:transition-[max-width] md:duration-200 md:group-hover:max-w-60">
        Back to role selection
      </div>
    </button>
  );
};

export default BackButton;
