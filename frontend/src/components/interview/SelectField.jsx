import { useId } from "react";
import { ChevronDown } from "lucide-react";

export default function SelectField({ label, value, onChange, options }) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-lg border border-white/10 bg-white/[0.04] pl-3.5 pr-10 text-sm text-white transition focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-[#0d1224] text-white">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    </div>
  );
}