"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Menu, User, Settings, LogOut, Home, FolderDot, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import AuthService from "@/services/auth";

export const ProfileDropdown: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
    setOpen(false);
    // Force reload after logout
    window.location.reload();
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <User className="h-5 w-5 text-gray-600" />
          <span className="sr-only">Open account menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="end" sideOffset={8}>
        <div className="flex flex-col space-y-1 p-2">


          <div className="px-2 py-1.5">
            {/* <p className="text-sm font-medium text-gray-900">Menu</p> */}
            <p className="text-xs text-gray-500">Maaree akoonkaaga</p>
          </div>

          <Separator className="my-1" />

          <Link
            href="/profile"
            onClick={handleLinkClick}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <User className="h-4 w-4" />
            Profile-kaaga
          </Link>

          <Link
            href="/settings"
            onClick={handleLinkClick}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Dejinta
          </Link>

          <Separator className="my-1" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left"
          >
            <LogOut className="h-4 w-4" />
            Ka bax
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
