export default function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border p-5 ${
        accent
          ? "border-accent/30 bg-accent-soft"
          : "border-line bg-surface"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          {label}
        </span>
        {Icon && (
          <Icon
            size={16}
            className={accent ? "text-accent" : "text-muted"}
          />
        )}
      </div>
      <p className={`font-display text-3xl font-bold ${accent ? "text-accent" : "text-ink"}`}>
        {value ?? "—"}
      </p>
    </div>
  );
}
