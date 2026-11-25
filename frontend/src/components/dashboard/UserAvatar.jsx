export default function UserAvatar({ name, size = "md" }) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-9 w-9 text-sm",
  };

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] font-semibold text-white ring-1 ring-white/20 ${sizes[size]}`}
    >
      {initial}
    </span>
  );
}