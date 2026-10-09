import { useState } from "react";
import { Heart } from "lucide-react";
import { getErrorMessage } from "../api/axiosClient";

/**
 * LikeButton — optimistic UI toggle.
 *
 * Props:
 *   initialLiked   boolean  — whether the current user has liked this item
 *   initialCount   number   — current like count
 *   onToggle       async fn — the API call to perform; must resolve/reject
 *   size           "sm" | "md"
 *   className      string
 */
export default function LikeButton({
  initialLiked = false,
  initialCount = 0,
  onToggle,
  size = "md",
  className = "",
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  const iconSize = size === "sm" ? 14 : 17;
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  const handleClick = async () => {
    if (busy) return;
    // Optimistic update
    setLiked((l) => !l);
    setCount((c) => (liked ? c - 1 : c + 1));
    setBusy(true);
    try {
      await onToggle();
    } catch (err) {
      // Revert on failure
      setLiked((l) => !l);
      setCount((c) => (liked ? c + 1 : c - 1));
      console.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors ${
        liked
          ? "border-accent/40 bg-accent-soft text-accent"
          : "border-line bg-surface text-muted hover:border-muted hover:text-ink"
      } ${className}`}
    >
      <Heart
        size={iconSize}
        className={liked ? "fill-accent text-accent" : ""}
      />
      <span className={`font-mono ${textSize}`}>{count}</span>
    </button>
  );
}
