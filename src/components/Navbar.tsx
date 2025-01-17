import Link from "next/link";

export default function Navbar() {
  return (
    <div className="bg-blue-500 text-white p-2 flex flex-row gap-4 rounded-md font-bold items-center">
      <Link
        href="/dashboard"
        className="cursor-pointer hover:bg-blue-600 p-2 rounded-md flex flex-col items-center"
      >
        Calendar
      </Link>
      <Link
        href="/practice-words"
        className="cursor-pointer hover:bg-blue-600 p-2 rounded-md flex flex-col items-center"
      >
        Practice words
      </Link>
      <Link
        href="/settings"
        className="cursor-pointer hover:bg-blue-600 p-2 rounded-md flex flex-col items-center"
      >
        Settings
      </Link>
      <Link
        href="/logout"
        className="cursor-pointer hover:bg-blue-600 p-2 rounded-md flex flex-col items-center"
      >
        Logout
      </Link>
    </div>
  );
}
