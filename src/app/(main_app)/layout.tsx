import Navbar from "@/components/Navbar";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 w-[90%] mx-auto py-4">
      <Navbar />
      {children}
    </div>
  );
}
