import { useEffect, useState } from "react";
import { Send, Trash2, Pencil, X, Check, ChevronDown } from "lucide-react";
import {
  createTweetRequest,
  getAllTweetsRequest,
  getUserTweetsRequest,
  updateTweetRequest,
  deleteTweetRequest,
} from "../api/tweet.api";
import { toggleTweetLikeRequest } from "../api/like.api";
import { getErrorMessage } from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/format";
import LikeButton from "../components/LikeButton";
import Spinner from "../components/Spinner";
import TallyDot from "../components/TallyDot";

const MAX_CHARS = 280;
const TABS = [
  { key: "all", label: "All Broadcasts" },
  { key: "mine", label: "My Broadcasts" },
];

export default function Tweets() {
  const { user } = useAuth();
  const [scope, setScope] = useState("all");
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  // Refetch whenever the scope tab changes
  useEffect(() => {
    if (!user?._id) return;
    let active = true;
    setLoading(true);
    setError("");
    setTweets([]);
    setPage(1);

    const request =
      scope === "mine"
        ? getUserTweetsRequest(user._id)
        : getAllTweetsRequest(1, 10);

    request
      .then((res) => {
        if (!active) return;
        const d = res.data.data;
        if (scope === "mine") {
          // getUserTweets returns a plain array, not paginated
          setTweets(Array.isArray(d) ? d : d?.tweets ?? d?.docs ?? []);
          setHasMore(false);
        } else {
          setTweets(d?.docs ?? []);
          setHasMore(Boolean(d?.hasNextPage));
        }
      })
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [scope, user?._id]);

  const loadMore = async () => {
    if (scope !== "all") return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await getAllTweetsRequest(nextPage, 10);
      const d = res.data.data;
      setTweets((prev) => [...prev, ...(d?.docs ?? [])]);
      setPage(nextPage);
      setHasMore(Boolean(d?.hasNextPage));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || trimmed.length > MAX_CHARS) return;
    setPosting(true);
    setError("");
    try {
      const res = await createTweetRequest(trimmed);
      const newTweet = res.data.data;
      // Only prepend locally if it belongs in the currently visible scope —
      // it always does, since a freshly created tweet is both "mine" and
      // part of "all".
      setTweets((prev) => [
        { ...newTweet, owner: user, isLiked: false, totalLikes: 0 },
        ...prev,
      ]);
      setDraft("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (tweetId) => {
    setTweets((prev) => prev.filter((t) => t._id !== tweetId));
    try {
      await deleteTweetRequest(tweetId);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleUpdate = async (tweetId, content) => {
    setTweets((prev) =>
      prev.map((t) => (t._id === tweetId ? { ...t, content } : t))
    );
    try {
      await updateTweetRequest(tweetId, content);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const remaining = MAX_CHARS - draft.length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <TallyDot />
        <h1 className="font-display text-2xl font-bold text-ink">Broadcasts</h1>
      </div>

      {/* Compose */}
      <form
        onSubmit={handlePost}
        className="mb-6 rounded-2xl border border-line bg-surface p-4"
      >
        <div className="flex gap-3">
          <img
            src={user?.avatar}
            alt={user?.username}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
          <textarea
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What's on air?"
            className="flex-1 resize-none bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
          />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span
            className={`font-mono text-xs ${
              remaining < 20
                ? remaining < 0
                  ? "text-accent"
                  : "text-amber-400"
                : "text-muted"
            }`}
          >
            {remaining}
          </span>
          <button
            type="submit"
            disabled={posting || !draft.trim() || remaining < 0}
            className="flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-bg disabled:opacity-40"
          >
            {posting ? <Spinner size="sm" /> : <Send size={12} />}
            {posting ? "Posting…" : "Broadcast"}
          </button>
        </div>
      </form>

      {error && (
        <p className="mb-4 rounded-lg border border-accent/40 bg-accent-soft px-3 py-2 text-xs text-accent">
          {error}
        </p>
      )}

      {/* Scope tabs */}
      <div className="mb-5 flex gap-1 border-b border-line">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setScope(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              scope === tab.key
                ? "border-b-2 border-accent text-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : tweets.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-muted">
            {scope === "mine"
              ? "You haven't broadcast anything yet."
              : "Nothing broadcast yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet._id}
              tweet={tweet}
              currentUser={user}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {scope === "all" && hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 rounded-full border border-line px-5 py-2 text-sm text-muted hover:border-accent hover:text-ink"
          >
            {loadingMore ? <Spinner size="sm" /> : <ChevronDown size={15} />}
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Single tweet card ─── */
function TweetCard({ tweet, currentUser, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(tweet.content);
  const [saving, setSaving] = useState(false);

  const owner = tweet.owner;
  const isOwner = currentUser?._id === owner?._id;

  const handleSave = async () => {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === tweet.content) {
      setEditing(false);
      return;
    }
    setSaving(true);
    await onUpdate(tweet._id, trimmed);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="group rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line/80">
      <div className="flex gap-3">
        <img
          src={owner?.avatar}
          alt={owner?.username}
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-ink">
                {owner?.username}
              </span>
              <span className="font-mono text-[10px] text-muted">
                {timeAgo(tweet.createdAt)}
              </span>
            </div>
            {isOwner && !editing && (
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => { setEditText(tweet.content); setEditing(true); }}
                  className="rounded-lg p-1.5 text-muted hover:text-ink"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => onDelete(tweet._id)}
                  className="rounded-lg p-1.5 text-muted hover:text-accent"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="mt-2">
              <textarea
                rows={3}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full resize-none rounded-xl border border-line bg-bg px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                autoFocus
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs text-bg disabled:opacity-50"
                >
                  {saving ? <Spinner size="sm" /> : <Check size={12} />}
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-1 rounded-full border border-line px-3 py-1 text-xs text-muted hover:text-ink"
                >
                  <X size={12} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1.5 text-sm text-ink/90">{tweet.content}</p>
          )}

          {!editing && (
            <div className="mt-3">
              <LikeButton
                initialLiked={tweet.isLiked ?? false}
                initialCount={tweet.totalLikes ?? 0}
                onToggle={() => toggleTweetLikeRequest(tweet._id)}
                size="sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
