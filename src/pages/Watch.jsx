import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getVideoByIdRequest } from "../api/video.api";
import { toggleVideoLikeRequest } from "../api/like.api";
import { getErrorMessage } from "../api/axiosClient";
import { formatCount, timeAgo } from "../utils/format";
import { useAuth } from "../context/AuthContext";
import TallyDot from "../components/TallyDot";
import Spinner from "../components/Spinner.jsx";
import LikeButton from "../components/LikeButton";
import SubscribeButton from "../components/SubscribeButton";
import CommentsSection from "../components/CommentsSection";

export default function Watch() {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchedForRef = useRef(null);
  useEffect(() => {
    console.log("WATCH EFFECT START", videoId);
  
    getVideoByIdRequest(videoId)
      .then((res) => {
        console.log("VIDEO RESPONSE", res);
        setVideo(res.data.data);
      })
      .catch((err) => {
        console.error("VIDEO ERROR", err);
        setError(getErrorMessage(err));
      })
      .finally(() => {
        console.log("VIDEO REQUEST FINISHED");
        setLoading(false);
      });
  }, [videoId]);


  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 font-mono text-sm text-muted">
        <TallyDot /> TUNING IN…
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-ink">{error || "This broadcast doesn't exist."}</p>
        <Link to="/" className="mt-3 inline-block text-sm text-accent hover:underline">
          Back to feed
        </Link>
      </div>
    );
  }

  const isOwner = user?._id === video.owner?._id;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-line bg-surface">
        <video
          key={video._id}
          src={video.videoFile?.url}
          poster={video.thumbnail?.url}
          controls
          className="h-full w-full"
        />
      </div>

      <h1 className="mt-4 font-display text-xl font-semibold text-ink">
        {video.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs text-muted">
          {formatCount(video.views)} views · {timeAgo(video.createdAt)}
        </p>
        <LikeButton
          initialLiked={video.isLiked ?? false}
          initialCount={video.totalLikes ?? 0}
          onToggle={() => toggleVideoLikeRequest(videoId)}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center gap-3">
          <img
            src={video.owner?.avatar}
            alt={video.owner?.username}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-ink">{video.owner?.username}</p>
            <p className="font-mono text-xs text-muted">
              {formatCount(video.owner?.subscriberCount)} subscribers
            </p>
          </div>
        </div>
        {!isOwner && video.owner?._id && (
          <SubscribeButton
            channelId={video.owner._id}
            initialSubbed={video.owner.isSubscribed ?? false}
            initialCount={video.owner.subscriberCount ?? 0}
          />
        )}
      </div>

      {video.description && <ExpandableDescription text={video.description} />}

      <CommentsSection videoId={videoId} />
    </div>
  );
}

function ExpandableDescription({ text }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 200;
  return (
    <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
      <p className={`whitespace-pre-wrap text-sm text-ink/90 ${!expanded && isLong ? "line-clamp-3" : ""}`}>
        {text}
      </p>
      {isLong && (
        <button onClick={() => setExpanded((e) => !e)} className="mt-2 text-xs text-accent hover:underline">
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
