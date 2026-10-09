import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { toggleSubscriptionRequest } from "../api/subscription.api";
import { getErrorMessage } from "../api/axiosClient";

/**
 * SubscribeButton
 *
 * Props:
 *   channelId        string
 *   initialSubbed    boolean
 *   initialCount     number
 *   onCountChange    fn(newCount) — optional, lets parent stay in sync
 */
export default function SubscribeButton({
  channelId,
  initialSubbed = false,
  initialCount = 0,
  onCountChange,
}) {
  const [subbed, setSubbed] = useState(initialSubbed);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    if (busy || !channelId) return;
    const wasSubbed = subbed;
    const newCount = wasSubbed ? count - 1 : count + 1;

    // Optimistic
    setSubbed(!wasSubbed);
    setCount(newCount);
    onCountChange?.(newCount);

    setBusy(true);
    setError("");
    try {
      await toggleSubscriptionRequest(channelId);
    } catch (err) {
      // Revert
      setSubbed(wasSubbed);
      setCount(count);
      onCountChange?.(count);
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleClick}
        disabled={busy}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
          subbed
            ? "border border-line bg-surface text-muted hover:border-accent hover:text-accent"
            : "bg-ink text-bg hover:bg-ink/90"
        }`}
      >
        {subbed ? <BellOff size={15} /> : <Bell size={15} />}
        {subbed ? "Subscribed" : "Subscribe"}
        <span className="font-mono text-xs opacity-70">
          ({count})
        </span>
      </button>
      {error && (
        <p className="text-xs text-accent">{error}</p>
      )}
    </div>
  );
}
