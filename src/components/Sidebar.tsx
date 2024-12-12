"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Settings, Users, File } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

const sidebarLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/pdf-creation", label: "PDF", icon: File },
  { href: "#", label: "Clientes", icon: Users },
  { href: "#", label: "Settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" width={64} height={64} alt="logo" />
          <span className="font-semibold text-xl">PrimoPhone</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 py-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Button
                key={link.href}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={onNavigate}
              >
                <Link href={link.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="mt-auto p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
        >
          <UserButton />
          Logout
        </Button>
      </div>
    </div>
  );
}
