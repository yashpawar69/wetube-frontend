import { Link } from "react-router-dom";
import { formatDuration, formatCount, timeAgo } from "../utils/format";

export default function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video._id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-line bg-surface group-hover:border-accent transition-colors">
        <img
          src={video.thumbnail?.url}
          alt={video.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute bottom-2 right-2 rounded bg-bg/85 px-1.5 py-0.5 font-mono text-[11px] text-ink">
          {formatDuration(video.duration)}
        </span>
      </div>
      <div className="flex gap-3">
        <img
          src={video.owner?.avatar}
          alt={video.owner?.username}
          className="h-9 w-9 shrink-0 rounded-full object-cover mt-0.5"
        />
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-medium text-ink group-hover:text-accent">
            {video.title}
          </h3>
          <p className="mt-1 truncate text-xs text-muted">
            {video.owner?.username}
          </p>
          <p className="font-mono text-[11px] text-muted">
            {formatCount(video.views)} views · {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
