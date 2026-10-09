import { useEffect, useState } from "react";
import {
  Eye, Users, ThumbsUp, Film,
  Trash2, ToggleLeft, ToggleRight, AlertCircle,
} from "lucide-react";
import {
  getDashboardStatsRequest,
  getDashboardVideosRequest,
} from "../api/dashboard.api";
import { api, getErrorMessage } from "../api/axiosClient";
import { formatCount, timeAgo } from "../utils/format";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";
import TallyDot from "../components/TallyDot";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStatsRequest()
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setStatsLoading(false));

    getDashboardVideosRequest()
      .then((res) => {
        const d = res.data.data;
        setVideos(d?.videos ?? d?.docs ?? d ?? []);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setVideosLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <TallyDot />
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Creator Studio
          </h1>
          <p className="text-sm text-muted">
            Your channel at a glance
          </p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* ─── Stat cards ─── */}
      {statsLoading ? (
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-line bg-surface"
            />
          ))}
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={Eye}
            label="Total Views"
            value={formatCount(stats?.totalViews)}
          />
          <StatCard
            icon={Users}
            label="Subscribers"
            value={formatCount(stats?.totalSubscribers ?? stats?.totalSubscriber)}
          />
          <StatCard
            icon={ThumbsUp}
            label="Total Likes"
            value={formatCount(stats?.totalLikes)}
            accent
          />
          <StatCard
            icon={Film}
            label="Videos"
            value={formatCount(stats?.totalVideos)}
          />
        </div>
      )}

      {/* ─── Video table ─── */}
      <div className="rounded-2xl border border-line bg-surface">
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-mono text-xs tracking-widest text-muted">
            YOUR BROADCASTS
          </h2>
        </div>

        {videosLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : videos.length === 0 ? (
          <div className="py-16 text-center">
            <Film size={32} className="mx-auto mb-3 text-muted/40" />
            <p className="text-sm text-muted">
              You haven't uploaded anything yet.
            </p>
          </div>
        ) : (
          <VideoTable videos={videos} setVideos={setVideos} />
        )}
      </div>
    </div>
  );
}

/* ─── Video management table ─── */
function VideoTable({ videos, setVideos }) {
  const [busyId, setBusyId] = useState(null);
  const [rowError, setRowError] = useState({});

  const handleTogglePublish = async (video) => {
    setBusyId(video._id);
    setRowError((e) => ({ ...e, [video._id]: "" }));

    // Optimistic
    setVideos((prev) =>
      prev.map((v) =>
        v._id === video._id ? { ...v, isPublished: !v.isPublished } : v
      )
    );

    try {
      await api.patch(`/videos/toggle/publish/${video._id}`);
    } catch (err) {
      // Revert
      setVideos((prev) =>
        prev.map((v) =>
          v._id === video._id ? { ...v, isPublished: video.isPublished } : v
        )
      );
      setRowError((e) => ({
        ...e,
        [video._id]: getErrorMessage(err),
      }));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Delete this video? This cannot be undone.")) return;
    setBusyId(videoId);
    setRowError((e) => ({ ...e, [videoId]: "" }));

    // Optimistic removal
    setVideos((prev) => prev.filter((v) => v._id !== videoId));

    try {
      await api.delete(`/videos/${videoId}`);
    } catch (err) {
      // Can't easily restore the exact row; just show error
      setRowError((e) => ({ ...e, [videoId]: getErrorMessage(err) }));
      setBusyId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            <th className="px-5 py-3 font-mono text-[10px] tracking-widest text-muted">
              VIDEO
            </th>
            <th className="px-4 py-3 font-mono text-[10px] tracking-widest text-muted">
              VIEWS
            </th>
            <th className="px-4 py-3 font-mono text-[10px] tracking-widest text-muted">
              UPLOADED
            </th>
            <th className="px-4 py-3 font-mono text-[10px] tracking-widest text-muted">
              STATUS
            </th>
            <th className="px-4 py-3 font-mono text-[10px] tracking-widest text-muted">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <VideoRow
              key={video._id}
              video={video}
              busy={busyId === video._id}
              rowError={rowError[video._id]}
              onToggle={handleTogglePublish}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VideoRow({ video, busy, rowError, onToggle, onDelete }) {
  return (
    <>
      <tr className="border-b border-line/50 transition-colors hover:bg-surface-hover">
        {/* Thumbnail + title */}
        <td className="px-5 py-3">
          <div className="flex items-center gap-3">
            <img
              src={video.thumbnail?.url ?? video.thumbnail}
              alt={video.title}
              className="h-12 w-20 shrink-0 rounded-lg object-cover"
            />
            <span className="line-clamp-2 max-w-xs text-ink">
              {video.title}
            </span>
          </div>
        </td>

        {/* Views */}
        <td className="px-4 py-3 font-mono text-muted">
          {formatCount(video.views)}
        </td>

        {/* Upload date */}
        <td className="px-4 py-3 font-mono text-muted whitespace-nowrap">
          {timeAgo(video.createdAt)}
        </td>

        {/* Publish toggle */}
        <td className="px-4 py-3">
          <button
            onClick={() => onToggle(video)}
            disabled={busy}
            title={video.isPublished ? "Click to unpublish" : "Click to publish"}
            className="flex items-center gap-1.5 font-mono text-xs disabled:opacity-40"
          >
            {video.isPublished ? (
              <>
                <ToggleRight size={18} className="text-signal" />
                <span className="text-signal">Live</span>
              </>
            ) : (
              <>
                <ToggleLeft size={18} className="text-muted" />
                <span className="text-muted">Draft</span>
              </>
            )}
          </button>
        </td>

        {/* Delete */}
        <td className="px-4 py-3">
          <button
            onClick={() => onDelete(video._id)}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted transition-colors hover:bg-accent-soft hover:text-accent disabled:opacity-40"
          >
            {busy ? <Spinner size="sm" /> : <Trash2 size={13} />}
            Delete
          </button>
        </td>
      </tr>
      {rowError && (
        <tr>
          <td colSpan={5} className="px-5 pb-2">
            <p className="text-xs text-accent">{rowError}</p>
          </td>
        </tr>
      )}
    </>
  );
}
