export default function Spinner({ size = "md", className = "" }) {
  const s = { sm: "h-4 w-4 border-2", md: "h-7 w-7 border-2", lg: "h-10 w-10 border-[3px]" }[size];
  return (
    <span
      className={`inline-block animate-spin rounded-full border-zinc-700 border-t-accent ${s} ${className}`}
      aria-label="Loading"
    />
  );
}
