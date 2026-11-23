
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "mt-1.5 w-full rounded border border-ink/30 bg-white px-3.5 py-3 outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/25";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
    setLoading(true);

    try {
      await login(form.email, form.password);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Log in"
      subtitle="Pick up where your last interview ended."
      footer={
        <>
          New here?{" "}
          <Link
            to="/register"
            className="font-semibold text-cobalt underline underline-offset-4"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">

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
            autoComplete="current-password"
            required
            value={form.password}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter your password"
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
          {loading ? "Logging in..." : "Log in"}
        </button>

      </form>
    </AuthLayout>
  );
}
