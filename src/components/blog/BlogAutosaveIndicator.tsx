import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudOff, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogAutosaveIndicatorProps {
  status: "idle" | "saving" | "saved" | "error";
  lastSaved?: Date | null;
  className?: string;
}

const BlogAutosaveIndicator = ({
  status,
  lastSaved,
  className,
}: BlogAutosaveIndicatorProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <AnimatePresence mode="wait">
        {status === "saving" && (
          <motion.div
            key="saving"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 text-muted-foreground"
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Saving...</span>
          </motion.div>
        )}

        {status === "saved" && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 text-green-600"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Saved</span>
            {lastSaved && (
              <span className="text-muted-foreground">
                at {formatTime(lastSaved)}
              </span>
            )}
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 text-destructive"
          >
            <CloudOff className="h-3.5 w-3.5" />
            <span>Save failed</span>
          </motion.div>
        )}

        {status === "idle" && lastSaved && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 text-muted-foreground"
          >
            <Cloud className="h-3.5 w-3.5" />
            <span>Last saved at {formatTime(lastSaved)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogAutosaveIndicator;
