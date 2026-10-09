import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { publishVideoRequest } from "../api/video.api";
import { getErrorMessage } from "../api/axiosClient";
import TallyDot from "../components/TallyDot";

export default function Upload() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!videoFile) {
      setError("A video file is required.");
      return;
    }
    if (!thumbnail) {
      setError("A thumbnail image is required.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnail);

      const res = await publishVideoRequest(formData);
      navigate(`/watch/${res.data.data._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center gap-2">
        <TallyDot />
        <h1 className="font-display text-xl font-semibold text-ink">
          Go on air
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-line bg-surface p-6"
      >
        {error && (
          <p className="mb-4 rounded-lg border border-accent/40 bg-accent-soft px-3 py-2 text-sm text-accent">
            {error}
          </p>
        )}

        {submitting && (
          <p className="mb-4 flex items-center gap-2 rounded-lg border border-line bg-bg px-3 py-2 font-mono text-xs text-muted">
            <TallyDot /> UPLOADING — this can take a while for large files,
            stay on this page.
          </p>
        )}

        <Field label="TITLE">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="DESCRIPTION">
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="VIDEO FILE">
          <input
            type="file"
            accept="video/*"
            required
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            className={fileClass}
          />
        </Field>

        <Field label="THUMBNAIL">
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
            className={fileClass}
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-bg hover:bg-accent/90 disabled:opacity-50"
        >
          {submitting ? "Uploading…" : "Publish"}
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";

const fileClass =
  "w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-line file:px-3 file:py-1.5 file:text-ink file:text-xs hover:file:bg-surface-hover";

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-xs font-mono text-muted">{label}</label>
      {children}
    </div>
  );
}
