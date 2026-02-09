import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  MessageCircle,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BlogSocialShareProps {
  title: string;
  url: string;
  className?: string;
  variant?: "horizontal" | "vertical";
}

const BlogSocialShare = ({
  title,
  url,
  className,
  variant = "horizontal",
}: BlogSocialShareProps) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-[#25D366]/10 hover:text-[#25D366]",
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (variant === "vertical") {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="h-10 w-10 rounded-full"
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Share2 className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Share</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col gap-2"
            >
              {shareLinks.map((link) => (
                <TooltipProvider key={link.name} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "p-2.5 rounded-full border border-border bg-background transition-colors",
                          link.color
                        )}
                      >
                        <link.icon className="h-4 w-4" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="left">{link.name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={copyLink}
                      className={cn(
                        "p-2.5 rounded-full border border-border bg-background transition-colors",
                        copied
                          ? "bg-green-500/10 text-green-500"
                          : "hover:bg-muted"
                      )}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <LinkIcon className="h-4 w-4" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {copied ? "Copied!" : "Copy Link"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm text-muted-foreground">Share:</span>
      <div className="flex items-center gap-1">
        {shareLinks.map((link) => (
          <TooltipProvider key={link.name} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "p-2 rounded-lg border border-border bg-background transition-colors",
                    link.color
                  )}
                >
                  <link.icon className="h-4 w-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent>{link.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={copyLink}
                className={cn(
                  "p-2 rounded-lg border border-border bg-background transition-colors",
                  copied ? "bg-green-500/10 text-green-500" : "hover:bg-muted"
                )}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <LinkIcon className="h-4 w-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>{copied ? "Copied!" : "Copy Link"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default BlogSocialShare;
