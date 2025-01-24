export default function CorrectAnswer({ grade }: { grade: number }) {
  return (
    <div className="bg-green-400 rounded-md p-4 w-full">
      <p>Your answer is correct! Your grade for this answer is ${grade}</p>
    </div>
  );
}
