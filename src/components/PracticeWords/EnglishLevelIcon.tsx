import { EnglishLevelType } from "@/lib/practiceWords/types";

function determineBgColor(englishLevel: EnglishLevelType) {
  switch (englishLevel) {
    case "A1":
      return "bg-red-400";
    case "A2":
      return "bg-orange-400";
    case "B1":
      return "bg-yellow-500";
    case "B2":
      return "bg-yellow-700";
    case "C1":
      return "bg-green-500";
    case "C2":
      return "bg-green-700";
  }
}

export default function EnglishLevelIcon({
  englishLevel,
}: {
  englishLevel: EnglishLevelType;
}) {
  return (
    <div
      className={`${determineBgColor(
        englishLevel
      )} py-1 px-2 rounded-full text-white font-semibold text-sm`}
    >
      {englishLevel}
    </div>
  );
}
