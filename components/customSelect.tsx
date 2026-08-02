import { ChevronDown } from "lucide-react";

interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label?: string;
  error?: string;
  options?: ReadonlyArray<Readonly<{ value: string; label: string }>>;
  isRequired?: boolean;
  remoteFocus?: boolean;
  isPatientSubmitted?: boolean;
}

const CustomSelect = ({
  id,
  label,
  error,
  options,
  isRequired = false,
  remoteFocus,
  isPatientSubmitted,
  ...props
}: CustomSelectProps) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <select
          id={id}
          {...props}
          disabled={props.disabled}
          className={`group w-full appearance-none rounded-md border ${error ? "border-red-500" : "border-gray-300"} py-2 pl-3 pr-10 focus:ring-1 focus:ring-blue-700 focus:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-200 ${remoteFocus ? "ring-2 ring-blue-700 border-blue-700 outline-none" : ""} ${props.value === "" && !props.disabled ? "text-gray-400" : ""}`}
        >
          {options && !isPatientSubmitted ? (
            <option value="" disabled>
              Select {label}
            </option>
          ) : (
            <option value="" disabled>
              -
            </option>
          )}
          {options ? (
            options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="text-black"
              >
                {option.label}
              </option>
            ))
          ) : (
            <option value={""} disabled className="text-black">
              No options available
            </option>
          )}
        </select>

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <ChevronDown />
        </span>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default CustomSelect;
