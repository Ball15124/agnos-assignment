interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
}

const CustomInput = ({ id, label, error, ...props }: CustomInputProps) => {
  return (
    <div className="flex flex-col w-full gap-2">
      {label && (
        <label htmlFor={id} className="mb-1 font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        type={props.type || "text"}
        {...props}
        className="border border-gray-300 rounded-md py-2 px-3"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default CustomInput;
