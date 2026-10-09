import { useEffect, useState, useRef } from "react";
import { Trash2, SendHorizonal, ChevronDown } from "lucide-react";
import {
  getCommentsRequest,
  addCommentRequest,
  deleteCommentRequest,
} from "../api/comment.api";
import { toggleCommentLikeRequest } from "../api/like.api";
import { getErrorMessage } from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/format";
import LikeButton from "./LikeButton";
import Spinner from "./Spinner";

export default function CommentsSection({ videoId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  // Initial load
  useEffect(() => {
    let active = true;
    setLoading(true);
    setComments([]);
    setPage(1);

    getCommentsRequest(videoId, 1, 10)
      .then((res) => {
        if (!active) return;
        const d = res.data.data;
        // Handle both paginated { docs, totalDocs } and plain array responses
        const docs = d?.docs ?? d ?? [];
        setComments(docs);
        setTotal(d?.totalDocs ?? docs.length);
        setHasMore(d?.hasNextPage ?? false);
      })
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [videoId]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await getCommentsRequest(videoId, nextPage, 10);
      const d = res.data.data;
      const docs = d?.docs ?? d ?? [];
      setComments((prev) => [...prev, ...docs]);
      setPage(nextPage);
      setHasMore(d?.hasNextPage ?? false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setPosting(true);
    setError("");
    try {
      const res = await addCommentRequest(videoId, trimmed);
      const newComment = res.data.data;
      // Attach current user data so the card renders immediately
      setComments((prev) => [
        { ...newComment, owner: user, isLiked: false, totalLikes: 0 },
        ...prev,
      ]);
      setTotal((t) => t + 1);
      setText("");
      textareaRef.current?.blur();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId) => {
    // Optimistic removal
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    setTotal((t) => t - 1);
    try {
      await deleteCommentRequest(commentId);
    } catch (err) {
      setError(getErrorMessage(err));
      // On failure, reload page 1 to restore correct state
      getCommentsRequest(videoId, 1, 10).then((res) => {
        const d = res.data.data;
        setComments(d?.docs ?? d ?? []);
      });
    }
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <h2 className="font-mono text-xs tracking-widest text-muted">
          COMMENTS
        </h2>
        <span className="rounded border border-line px-2 py-0.5 font-mono text-[10px] text-muted">
          {total}
        </span>
      </div>

      {/* Compose */}
      <form onSubmit={handlePost} className="mb-6 flex gap-3">
        <img
          src={user?.avatar}
          alt={user?.username}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
        <div className="flex flex-1 flex-col gap-2">
          <textarea
            ref={textareaRef}
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
            className="w-full resize-none rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
          {text.trim() && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={posting}
                className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-bg disabled:opacity-50"
              >
                {posting ? (
                  <Spinner size="sm" />
                ) : (
                  <SendHorizonal size={13} />
                )}
                {posting ? "Posting…" : "Comment"}
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Error */}
      {error && (
        <p className="mb-4 rounded-lg border border-accent/40 bg-accent-soft px-3 py-2 text-xs text-accent">
          {error}
        </p>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : comments.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">
          No comments yet. Be the first.
        </p>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              currentUser={user}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 rounded-full border border-line px-5 py-2 text-sm text-muted hover:border-accent hover:text-ink"
          >
            {loadingMore ? <Spinner size="sm" /> : <ChevronDown size={15} />}
            {loadingMore ? "Loading…" : "Load more comments"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Individual comment card ─── */
function CommentCard({ comment, currentUser, onDelete }) {
  const owner = comment.owner ?? comment.CommentOwnerDetails;
  const isOwner = currentUser?._id === owner?._id;

  return (
    <div className="group flex gap-3">
      <img
        src={owner?.avatar}
        alt={owner?.username}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-ink">
            {owner?.username}
          </span>
          <span className="font-mono text-[10px] text-muted">
            {timeAgo(comment.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink/90">{comment.content}</p>
        <div className="mt-2 flex items-center gap-2">
          <LikeButton
            initialLiked={comment.isLiked ?? false}
            initialCount={comment.totalLikes ?? 0}
            onToggle={() => toggleCommentLikeRequest(comment._id)}
            size="sm"
          />
          {isOwner && (
            <button
              onClick={() => onDelete(comment._id)}
              className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-muted opacity-0 transition-opacity hover:text-accent group-hover:opacity-100"
            >
              <Trash2 size={12} />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
