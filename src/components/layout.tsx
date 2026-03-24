export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-dvh overflow-hidden">{children}</div>
  );
}
