import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { getLikedVideosRequest } from "../api/like.api";
import { getErrorMessage } from "../api/axiosClient";
import { formatCount, formatDuration, timeAgo } from "../utils/format";
import Spinner from "../components/Spinner";
import TallyDot from "../components/TallyDot";

export default function LikedVideos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getLikedVideosRequest()
      .then((res) => setItems(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <TallyDot />
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Liked Videos</h1>
          <p className="text-sm text-muted">{items.length} video{items.length !== 1 ? "s" : ""}</p>
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
      ) : items.length === 0 ? (
        <div className="py-20 text-center">
          <Heart size={36} className="mx-auto mb-3 text-muted/30" />
          <p className="text-ink">No liked videos yet.</p>
          <p className="mt-1 text-sm text-muted">Videos you like will appear here.</p>
          <Link to="/" className="mt-4 inline-block text-sm text-accent hover:underline">
            Browse videos
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const video = item.videoDetails;
            if (!video) return null;
            // ownerDetails comes back as an array from the aggregate pipeline
            const owner = Array.isArray(video.ownerDetails)
              ? video.ownerDetails[0]
              : video.ownerDetails;

            return (
              <Link
                key={item._id}
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
                  <p className="mt-1 text-xs text-muted">{owner?.username}</p>
                  <p className="font-mono text-[11px] text-muted">
                    {formatCount(video.views)} views · {timeAgo(video.createdAt)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center pr-2">
                  <Heart size={15} className="fill-accent text-accent" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
