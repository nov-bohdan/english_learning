export default function Error({ message }: { message: string }) {
  return (
    <div className="bg-red-500 text-white font-bold w-full p-4 rounded-md my-4">
      Error: {message}
    </div>
  );
}
