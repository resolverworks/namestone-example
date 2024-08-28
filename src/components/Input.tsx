type InputProps = {
  placeholder: string
  suffix?: string
  label?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function Input({ placeholder, suffix, label, ...props }: InputProps) {
  return (
    <div className="flex flex-col">
      {label && <label className="pl-2 text-left">{label}</label>}

      <div className="flex items-center rounded-lg border border-brand-orange bg-white">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-transparent px-3 py-2 outline-none"
          {...props}
        />

        {suffix && (
          <span className="border-l border-brand-orange px-4 py-2">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}
