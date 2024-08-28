type InputProps = {
  placeholder: string
  suffix?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function Input({ placeholder, suffix, ...props }: InputProps) {
  return (
    <div className="border-brand-orange flex items-center rounded-lg border bg-white">
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent px-3 py-2 outline-none"
        {...props}
      />

      {suffix && (
        <span className="border-brand-orange border-l px-4 py-2">{suffix}</span>
      )}
    </div>
  )
}
