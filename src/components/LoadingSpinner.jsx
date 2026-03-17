export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
      <span>{label}</span>
    </div>
  );
}

