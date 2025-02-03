export default function NewWordForm({
  getWordInfoAction,
  getWordInfoPending,
}: {
  getWordInfoAction: (payload: FormData) => void;
  getWordInfoPending: boolean;
}) {
  return (
    <form
      action={getWordInfoAction}
      autoComplete="off"
      className="flex items-center justify-center"
    >
      <div className="flex flex-col gap-6 w-full max-w-md bg-white p-8 rounded-xl shadow-md transform transition-all">
        <input
          type="text"
          name="word"
          placeholder="Input a word..."
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
        />
        <button
          type="submit"
          disabled={getWordInfoPending}
          className="w-full p-4 bg-blue-500 hover:bg-blue-600 transition-colors rounded-xl font-semibold text-white text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </form>
  );
}
