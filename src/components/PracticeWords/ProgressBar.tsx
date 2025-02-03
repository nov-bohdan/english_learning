export default function ProgressBar({ progress }: { progress: number }) {
  const getColor = () => {
    if (progress < 33) return "bg-red-500"; // Red for low progress
    if (progress < 66) return "bg-yellow-500"; // Yellow for medium progress
    return "bg-green-500"; // Green for high progress
  };

  // Compute a value to use for width display; if progress is 0, show 1% so that the bar is visible.
  const computedProgress =
    progress === 0 ? 1 : Math.max(0, Math.min(progress, 100));

  return (
    <div className="relative w-full bg-gray-200 rounded-lg h-4 overflow-hidden">
      <div
        className={`${getColor()} h-full transition-all duration-300 rounded-l-lg ${
          computedProgress === 100 ? "rounded-r-lg" : ""
        }`}
        style={{ width: `${computedProgress}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
        {progress}%
      </span>
    </div>
  );
}
