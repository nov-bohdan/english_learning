import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-md text-base font-bold transition-colors hover:bg-blue-700"
            >
              Calendar
            </Link>
            <Link
              href="/words"
              className="px-3 py-2 rounded-md text-base font-bold transition-colors hover:bg-blue-700"
            >
              Practice Words
            </Link>
            <Link
              href="/settings"
              className="px-3 py-2 rounded-md text-base font-bold transition-colors hover:bg-blue-700"
            >
              Settings
            </Link>
            <Link
              href="/signout"
              className="px-3 py-2 rounded-md text-base font-bold transition-colors hover:bg-blue-700"
            >
              Sign out
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
