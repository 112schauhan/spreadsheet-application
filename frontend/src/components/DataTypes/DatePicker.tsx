import React from "react"

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  disabled?: boolean
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  error,
  disabled,
  ...props
}) => {
  return (
    <input
      type="date"
      value={value}
      onChange={onChange}
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

export default DatePicker
