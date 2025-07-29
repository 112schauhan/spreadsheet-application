import React from "react"

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number | ""
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  min?: number
  max?: number
  step?: number
  error?: boolean
  disabled?: boolean
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  error,
  disabled,
  ...props
}) => {
  return (
    <input
      type="number"
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
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

export default NumberInput
