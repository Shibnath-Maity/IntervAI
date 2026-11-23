
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "mt-1.5 w-full rounded border border-ink/30 bg-white px-3.5 py-3 outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/25";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(
        form.name,
        form.email,
        form.password
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes a minute. Then upload your resume and start."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-cobalt underline underline-offset-4"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        <label className="block text-[15px] font-medium">
          Full name

          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={60}
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="Your full name"
          />
        </label>

        <label className="block text-[15px] font-medium">
          Email

          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="you@example.com"
          />
        </label>

        <label className="block text-[15px] font-medium">
          Password

          <input
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={form.password}
            onChange={handleChange}
            className={inputClass}
            placeholder="Create a password"
          />

          <span className="mt-1.5 block text-sm font-normal text-ink/60">
            At least 8 characters.
          </span>
        </label>

        <label className="block text-[15px] font-medium">
          Confirm password

          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            className={inputClass}
            placeholder="Confirm your password"
          />
        </label>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-ink py-3.5 font-semibold text-white hover:bg-cobalt disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

      </form>
    </AuthLayout>
  );
}
