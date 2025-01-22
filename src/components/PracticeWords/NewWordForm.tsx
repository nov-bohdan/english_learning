export default function NewWordForm({
  wordInfoAction,
  wordInfoPending,
}: {
  wordInfoAction: (payload: FormData) => void;
  wordInfoPending: boolean;
}) {
  return (
    <form action={wordInfoAction}>
      <div className="flex flex-col gap-4 w-[80%] items-center mx-auto">
        <input
          type="text"
          name="word"
          placeholder="Input a word..."
          className="p-4 border-2 border-gray-400 outline-none rounded-xl w-1/2"
        ></input>
        <button
          type="submit"
          className="p-4 bg-blue-500 rounded-xl w-40 font-semibold text-white text-2xl disabled:bg-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={wordInfoPending}
        >
          Send
        </button>
      </div>
    </form>
  );
}
