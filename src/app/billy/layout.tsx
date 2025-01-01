export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-7xl">dice game or something</h1>
        {children}
      </div>
    </>
  );
}
