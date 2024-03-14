export default function ContentBlock({ children }: { children: React.ReactNode }) {
  return <div className="h-full w-full overflow-hidden rounded-sm bg-[#F7F8FA] shadow-sm">{children}</div>;
}
