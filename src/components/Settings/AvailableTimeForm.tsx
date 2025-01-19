export default function AvailableTimeForm({
  availableTime,
  handleSaveAvailableTime,
}: {
  availableTime: { [key: number]: number };
  handleSaveAvailableTime: (availableTime: { [key: number]: number }) => void;
}) {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold">Available time</h2>
      <h3 className="text-sm text-gray-500">
        Available time for each day of the week (in minutes).
      </h3>
      {daysOfWeek.map((day, index) => (
        <div key={day} className="flex flex-row gap-2 items-center">
          <p>{day}</p>
          <input
            type="number"
            value={availableTime[index]}
            onChange={(e) =>
              handleSaveAvailableTime({
                ...availableTime,
                [index]: Number(e.target.value),
              })
            }
            className="bg-gray-400 rounded-md p-2 w-20 appearance-none"
          />
        </div>
      ))}
    </div>
  );
}
