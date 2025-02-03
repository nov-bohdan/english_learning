export default function Error({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 bg-red-100 border border-red-400 text-red-700 p-4 rounded-md my-4">
      <svg
        className="w-6 h-6 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
        />
      </svg>
      <span className="font-medium">Error: {message}</span>
    </div>
  );
}
