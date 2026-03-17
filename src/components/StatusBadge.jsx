const STATUS_STYLES = {
  waiting: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
  skipped: "bg-gray-100 text-gray-600",
  queued: "bg-purple-100 text-purple-700",
};

export default function StatusBadge({ status }) {
  if (!status) return null;

  const raw = String(status).toLowerCase();
  const normalized = raw.replace("-", "_");
  const cls = STATUS_STYLES[normalized] || "bg-gray-100 text-gray-600";

  const label =
    normalized === "in_progress"
      ? "In Progress"
      : raw.charAt(0).toUpperCase() + raw.slice(1);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

