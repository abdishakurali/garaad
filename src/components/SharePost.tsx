"use client";

import { useState } from "react";
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  LinkIcon,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SharePostProps {
  title: string;
  slug: string;
}

export function SharePost({ title, slug }: SharePostProps) {
  const [copied, setCopied] = useState(false);

  // Get the full URL for sharing
  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/blog/${slug}`;
  };

  // Handle copy to clipboard
  const copyToClipboard = async () => {
    const url = getShareUrl();

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);


      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors
    }
  };

  // Share URLs for different platforms
  const getTwitterShareUrl = () => {
    const url = getShareUrl();
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`;
  };

  const getFacebookShareUrl = () => {
    const url = getShareUrl();
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
  };

  const getLinkedInShareUrl = () => {
    const url = getShareUrl();
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full"
          aria-label="La wadaag qoraalkan"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a
            href={getTwitterShareUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center cursor-pointer"
          >
            <Twitter className="mr-2 h-4 w-4" />
            <span>Twitter</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={getFacebookShareUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center cursor-pointer"
          >
            <Facebook className="mr-2 h-4 w-4" />
            <span>Facebook</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={getLinkedInShareUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center cursor-pointer"
          >
            <Linkedin className="mr-2 h-4 w-4" />
            <span>LinkedIn</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>La koobiyey!</span>
            </>
          ) : (
            <>
              <LinkIcon className="mr-2 h-4 w-4" />
              <span>Koobi linkiga</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
