import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/axiosClient";
import TallyDot from "../components/TallyDot";

const initialForm = { fullName: "", email: "", username: "", password: "" };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!avatar) {
      setError("An avatar image is required.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("avatar", avatar);
      if (coverImage) formData.append("coverImage", coverImage);

      await register(formData);
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <TallyDot />
          <span className="font-display text-xl font-bold text-ink">
            WE<span className="text-accent">·</span>TUBE
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-line bg-surface p-6"
        >
          <h1 className="mb-1 font-display text-lg font-semibold text-ink">
            Create an account
          </h1>
          <p className="mb-6 text-sm text-muted">
            Set up your channel to start uploading.
          </p>

          {error && (
            <p className="mb-4 rounded-lg border border-accent/40 bg-accent-soft px-3 py-2 text-sm text-accent">
              {error}
            </p>
          )}

          <Field label="FULL NAME">
            <input
              type="text"
              required
              value={form.fullName}
              onChange={updateField("fullName")}
              className={inputClass}
            />
          </Field>

          <Field label="USERNAME">
            <input
              type="text"
              required
              value={form.username}
              onChange={updateField("username")}
              className={inputClass}
              autoComplete="username"
            />
          </Field>

          <Field label="EMAIL">
            <input
              type="email"
              required
              value={form.email}
              onChange={updateField("email")}
              className={inputClass}
              autoComplete="email"
            />
          </Field>

          <Field label="PASSWORD">
            <input
              type="password"
              required
              value={form.password}
              onChange={updateField("password")}
              className={inputClass}
              autoComplete="new-password"
            />
          </Field>

          <Field label="AVATAR (REQUIRED)">
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              className="w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-line file:px-3 file:py-1.5 file:text-ink file:text-xs hover:file:bg-surface-hover"
            />
          </Field>

          <Field label="COVER IMAGE (OPTIONAL)">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-line file:px-3 file:py-1.5 file:text-ink file:text-xs hover:file:bg-surface-hover"
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-bg hover:bg-accent/90 disabled:opacity-50"
          >
            {submitting ? "Creating account…" : "Sign up"}
          </button>

          <p className="mt-5 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-accent hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-xs font-mono text-muted">{label}</label>
      {children}
    </div>
  );
}
