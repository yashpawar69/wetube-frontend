// The pulsing ember dot is WeTube's signature element — a tally light,
// borrowed from the on-air indicator on a broadcast camera. It shows up by
// the wordmark, on the upload screen, and faintly on video cards.
export default function TallyDot({ className = "", pulse = true }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full bg-accent ${
        pulse ? "tally-dot" : ""
      } ${className}`}
      aria-hidden="true"
    />
  );
}
