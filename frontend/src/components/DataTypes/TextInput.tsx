import React from "react"

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  disabled?: boolean
  placeholder?: string
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  error,
  disabled,
  placeholder,
  ...props
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 transition ${
        error
          ? "border-red-500 focus:ring-red-400"
          : "border-gray-300 focus:ring-blue-400"
      } disabled:bg-gray-100 disabled:cursor-not-allowed`}
      {...props}
    />
  )
}

export default TextInput
