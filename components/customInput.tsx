interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
  isRequired?: boolean;
  remoteFocus?: boolean;
}

const CustomInput = ({
  id,
  label,
  error,
  isRequired = false,
  remoteFocus,
  ...props
}: CustomInputProps) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        {...props}
        className={`w-full min-w-0 border  rounded-md py-2 px-3 ${error ? "border-red-500" : "border-gray-300"} disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed ${remoteFocus ? "ring-2 ring-blue-700 border-blue-700 outline-none" : ""} focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700 ${props.disabled ? "placeholder:text-black" : "placeholder:text-gray-400"}`}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default CustomInput;
