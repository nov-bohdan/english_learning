"use client";

export default function NewActivityForm({
  saveNewActivityAction,
}: {
  saveNewActivityAction: (payload: FormData) => void;
}) {
  return (
    <form action={saveNewActivityAction}>
      <div className="flex flex-col gap-2">
        <label htmlFor="activity-name">Activity name</label>
        <input
          type="text"
          placeholder="Activity name"
          name="activity_name"
          className="border-2 border-gray-300 rounded-md p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Add activity
        </button>
      </div>
    </form>
  );
}
