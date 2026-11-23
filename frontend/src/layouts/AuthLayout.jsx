import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen bg-paper font-body text-ink antialiased lg:grid-cols-[1fr_0.9fr]">
      <div className="flex flex-col px-6 py-6 sm:px-12">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          IntervAI
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-ink/70">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-8 text-[15px] text-ink/70">{footer}</p>
        </div>
      </div>

      <aside className="hidden flex-col justify-end bg-cobalt p-12 text-white lg:flex">
        <p className="max-w-sm font-display text-3xl font-bold leading-tight tracking-tight">
          Every answer gets a score and a reason for it.
        </p>
        <p className="mt-4 max-w-sm text-white/80">Your Interview. Your Future.</p>
      </aside>
    </div>
  );
}