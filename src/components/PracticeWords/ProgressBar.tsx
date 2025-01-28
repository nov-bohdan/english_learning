export default function ProgressBar({ progress }: { progress: number }) {
  const getColor = () => {
    if (progress < 33) return "bg-red-500"; // Red for low progress
    if (progress < 66) return "bg-yellow-500"; // Yellow for medium progress
    return "bg-green-500"; // Green for high progress
  };

  if (progress === 0) {
    progress = 1;
  }

  return (
    <div className="w-full bg-gray-200 rounded-lg h-4 overflow-hidden">
      <div
        className={`${getColor()} h-full rounded-lg transition-all duration-300`}
        style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
      />
    </div>
  );
}
