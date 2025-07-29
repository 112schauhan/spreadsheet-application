import React, { useRef } from "react"

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  accept?: string
  multiple?: boolean
  label?: string
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  accept = "*",
  multiple = false,
  label = "Upload File",
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    Array.from(e.target.files).forEach(onFileSelect)
    e.target.value = "" // reset to allow same file re-selection
  }

  return (
    <div>
      <button
        type="button"
        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        onClick={() => fileInputRef.current?.click()}
      >
        {label}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        multiple={multiple}
        className="hidden"
      />
    </div>
  )
}

export default FileUploader
