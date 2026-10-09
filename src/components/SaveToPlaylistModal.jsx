import { useEffect, useState } from "react";
import { X, Plus, Check, ListVideo } from "lucide-react";
import {
  getUserPlaylistsRequest,
  createPlaylistRequest,
  addVideoToPlaylistRequest,
  removeVideoFromPlaylistRequest,
} from "../api/playlist.api";
import { getErrorMessage } from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

/**
 * SaveToPlaylistModal
 *
 * Props:
 *   videoId     string   — the video to add/remove
 *   onClose     fn       — close handler
 */
export default function SaveToPlaylistModal({ videoId, onClose }) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getUserPlaylistsRequest(user._id)
      .then((res) => {
        const d = res.data.data;
        setPlaylists(Array.isArray(d) ? d : d?.playlists ?? []);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [user._id]);

  // Checks if this video is already in a given playlist
  const videoInPlaylist = (playlist) =>
    playlist.videos?.some((v) => (v._id ?? v) === videoId);

  const handleToggle = async (playlist) => {
    setBusyId(playlist._id);
    const inPlaylist = videoInPlaylist(playlist);
    try {
      if (inPlaylist) {
        await removeVideoFromPlaylistRequest(videoId, playlist._id);
        setPlaylists((prev) =>
          prev.map((p) =>
            p._id === playlist._id
              ? { ...p, videos: p.videos.filter((v) => (v._id ?? v) !== videoId) }
              : p
          )
        );
      } else {
        await addVideoToPlaylistRequest(videoId, playlist._id);
        setPlaylists((prev) =>
          prev.map((p) =>
            p._id === playlist._id
              ? { ...p, videos: [...(p.videos ?? []), videoId] }
              : p
          )
        );
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await createPlaylistRequest(newName.trim(), newDesc.trim());
      const playlist = res.data.data;
      setPlaylists((prev) => [...prev, { ...playlist, videos: [] }]);
      setNewName("");
      setNewDesc("");
      setShowCreate(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <ListVideo size={16} className="text-muted" />
            <h2 className="font-display text-sm font-semibold text-ink">
              Save to Playlist
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-80 overflow-y-auto px-5 py-3">
          {error && (
            <p className="mb-3 text-xs text-accent">{error}</p>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : playlists.length === 0 && !showCreate ? (
            <p className="py-6 text-center text-sm text-muted">
              No playlists yet. Create one below.
            </p>
          ) : (
            <ul className="space-y-1">
              {playlists.map((pl) => {
                const inList = videoInPlaylist(pl);
                const busy = busyId === pl._id;
                return (
                  <li key={pl._id}>
                    <button
                      onClick={() => handleToggle(pl)}
                      disabled={busy}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-surface-hover disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                            inList
                              ? "border-accent bg-accent"
                              : "border-line bg-bg"
                          }`}
                        >
                          {inList && <Check size={11} className="text-bg" />}
                        </div>
                        <span className="truncate">{pl.name}</span>
                      </div>
                      {busy && <Spinner size="sm" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Create new playlist */}
        <div className="border-t border-line px-5 py-4">
          {showCreate ? (
            <form onSubmit={handleCreate} className="flex flex-col gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Playlist name"
                autoFocus
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Description (optional)"
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={creating || !newName.trim()}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent py-2 text-xs font-medium text-bg disabled:opacity-50"
                >
                  {creating ? <Spinner size="sm" /> : <Plus size={13} />}
                  {creating ? "Creating…" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl border border-line px-4 py-2 text-xs text-muted hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowCreate(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line py-2 text-sm text-muted hover:border-accent hover:text-accent"
            >
              <Plus size={15} />
              New playlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
