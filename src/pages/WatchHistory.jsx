import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { History } from "lucide-react";
import { getWatchHistoryRequest } from "../api/auth.api";
import { getErrorMessage } from "../api/axiosClient";
import { formatCount, formatDuration, timeAgo } from "../utils/format";
import Spinner from "../components/Spinner";
import TallyDot from "../components/TallyDot";

export default function WatchHistory() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getWatchHistoryRequest()
      .then((res) => {
        setVideos(res.data.data ?? []);
      })
      .catch((err) => {
        setError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <TallyDot />

        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Watch History
          </h1>

          <p className="text-sm text-muted">
            {videos.length} video{videos.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : videos.length === 0 ? (
        <div className="py-20 text-center">
          <History size={36} className="mx-auto mb-3 text-muted/30" />

          <p className="text-ink">No watch history yet.</p>

          <p className="mt-1 text-sm text-muted">
            Videos you watch will appear here.
          </p>

          <Link
            to="/"
            className="mt-4 inline-block text-sm text-accent hover:underline"
          >
            Browse videos
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((video) => (
            <Link
              key={video._id}
              to={`/watch/${video._id}`}
              className="group flex gap-4 rounded-2xl border border-line bg-surface p-3 transition-colors hover:border-accent/40"
            >
              <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-xl">
                <img
                  src={video.thumbnail?.url ?? video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />

                <span className="absolute bottom-1.5 right-1.5 rounded bg-bg/85 px-1 py-0.5 font-mono text-[10px] text-ink">
                  {formatDuration(video.duration)}
                </span>
              </div>

              <div className="min-w-0 flex-1 py-1">
                <h3 className="line-clamp-2 text-sm font-medium text-ink group-hover:text-accent">
                  {video.title}
                </h3>

                <p className="mt-1 text-xs text-muted">
                  {video.owner?.username}
                </p>

                <p className="font-mono text-[11px] text-muted">
                  {formatCount(video.views)} views ·{" "}
                  {timeAgo(video.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}