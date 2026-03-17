import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-semibold text-gray-900">Page not found</h1>
      <p className="mt-2 text-sm text-gray-500">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        Go back home
      </Link>
    </div>
  );
}

export function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-semibold text-gray-900">Access denied</h1>
      <p className="mt-2 text-sm text-gray-500">
        You don&apos;t have permission to view this page.
      </p>
      <Link
        to="/"
        className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        Go to your dashboard
      </Link>
    </div>
  );
}

