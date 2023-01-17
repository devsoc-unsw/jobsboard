import React from 'react';

type InputProps = {
  name: string;
  disabled?: boolean;
  type: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  onChange(value: string, e?: React.ChangeEvent): void;
  value: string;
  onKeyUp?(key: string, e?: React.KeyboardEvent): void;
};

const Input = ({
  name,
  disabled,
  type,
  autoComplete,
  placeholder,
  required,
  onChange,
  value,
  onKeyUp
}: InputProps) => {
  return (
    <input
      id={name}
      name={name}
      disabled={disabled}
      placeholder={placeholder}
      type={type}
      className="font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer"
      autoComplete={autoComplete}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value, e)}
      onKeyUp={(e) => onKeyUp && onKeyUp(e.key, e)}
    />
  );
};

export default Input;
