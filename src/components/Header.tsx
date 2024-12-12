import { MobileSidebar } from "@/components/mobile-sidebar";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-[5.3em] items-center border-b bg-background px-4">
      <MobileSidebar />
      <div className="flex-1" />
    </header>
  );
}