interface InputProps {
  id: string;
  name: string;
  type: string;
  required?: boolean;
  autoComplete: string;
  autoFocus?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  extraClassName?: string;
  ref?: React.RefObject<HTMLInputElement>;
}

const Input = ({
  id,
  name,
  type,
  required = false,
  autoComplete = "off",
  autoFocus = false,
  value,
  onChange,
  placeholder = "Enter your text",
  extraClassName = "",
  ref,
}: InputProps) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 
      outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 
      focus:outline-indigo-600 sm:text-sm/6 ${extraClassName}`}
      ref={ref}
    />
  );
};

export default Input;
