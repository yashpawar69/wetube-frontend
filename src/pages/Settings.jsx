import { useRef, useState } from "react";
import {
  updateAccountRequest,
  changePasswordRequest,
  updateUserAvatar,
  updateUserCoverImage,
} from "../api/auth.api";
import { getErrorMessage } from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import TallyDot from "../components/TallyDot";
import Spinner from "../components/Spinner";

export default function Settings() {
  const { user } = useAuth();

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [coverImage, setCoverImage] = useState(user?.coverImage ?? "");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const clearStatus = () => {
    setMessage("");
    setError("");
  };

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    clearStatus();

    try {
      setAccountLoading(true);

      await updateAccountRequest({
        fullName,
        email,
      });

      setMessage("Account details updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setAccountLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    clearStatus();

    if (!oldPassword || !newPassword) {
      setError("Please enter both passwords.");
      return;
    }

    try {
      setPasswordLoading(true);

      await changePasswordRequest(oldPassword, newPassword);

      setOldPassword("");
      setNewPassword("");
      setMessage("Password changed successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    clearStatus();

    try {
      setAvatarLoading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await updateUserAvatar(formData);

      setAvatar(res.data.data.avatar);
      setMessage("Avatar updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setAvatarLoading(false);
      e.target.value = "";
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    clearStatus();

    try {
      setCoverLoading(true);

      const formData = new FormData();
      formData.append("coverImage", file);

      const res = await updateUserCoverImage(formData);

      setCoverImage(res.data.data.coverImage);
      setMessage("Cover image updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCoverLoading(false);
      e.target.value = "";
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <TallyDot />

        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Settings
          </h1>

          <p className="text-sm text-muted">
            Manage your account and profile
          </p>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
          {error}
        </div>
      )}

      {/* PROFILE IMAGES */}
      <section className="mb-6 rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-lg font-semibold text-ink">
          Profile
        </h2>

        <p className="mt-1 text-sm text-muted">
          Update your profile picture and cover image.
        </p>

        {/* COVER */}
        <div className="relative mt-5 h-40 overflow-hidden rounded-xl bg-bg">
          {coverImage ? (
            <img
              src={coverImage}
              alt="Cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              No cover image
            </div>
          )}

          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={coverLoading}
            className="absolute bottom-3 right-3 rounded-xl bg-bg/85 px-3 py-2 text-xs font-medium text-ink backdrop-blur hover:bg-bg disabled:opacity-50"
          >
            {coverLoading ? "Uploading..." : "Change cover"}
          </button>
        </div>

        {/* AVATAR */}
        <div className="mt-5 flex items-center gap-4">
          <img
            src={avatar}
            alt={user.username}
            className="h-20 w-20 rounded-full border-4 border-bg object-cover"
          />

          <div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarLoading}
              className="rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink hover:border-accent/40 disabled:opacity-50"
            >
              {avatarLoading ? "Uploading..." : "Change avatar"}
            </button>

            <p className="mt-2 text-xs text-muted">
              JPG, PNG or other supported image format
            </p>
          </div>
        </div>
      </section>

      {/* ACCOUNT */}
      <section className="mb-6 rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-lg font-semibold text-ink">
          Account details
        </h2>

        <form onSubmit={handleAccountUpdate} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Full name
            </label>

            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={accountLoading}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {accountLoading ? "Saving..." : "Save changes"}
          </button>
        </form>
      </section>

      {/* PASSWORD */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-lg font-semibold text-ink">
          Security
        </h2>

        <p className="mt-1 text-sm text-muted">
          Change your account password.
        </p>

        <form onSubmit={handlePasswordChange} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Current password
            </label>

            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              New password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink hover:border-accent/40 disabled:opacity-50"
          >
            {passwordLoading ? "Changing..." : "Change password"}
          </button>
        </form>
      </section>
    </div>
  );
}