import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface BlogTableOfContentsProps {
  content: string;
  className?: string;
}

const BlogTableOfContents = ({ content, className }: BlogTableOfContentsProps) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Parse headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const elements = doc.querySelectorAll("h1, h2, h3");

    const items: TOCItem[] = [];
    elements.forEach((el, index) => {
      const id = `heading-${index}`;
      const text = el.textContent || "";
      const level = parseInt(el.tagName.charAt(1));
      if (text.trim()) {
        items.push({ id, text, level });
      }
    });

    setHeadings(items);
  }, [content]);

  useEffect(() => {
    // Add IDs to actual headings in the DOM and set up intersection observer
    const articleElement = document.querySelector("article");
    if (!articleElement) return;

    const headingElements = articleElement.querySelectorAll("h1, h2, h3");
    headingElements.forEach((el, index) => {
      el.id = `heading-${index}`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [content, headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className={cn("sticky top-24", className)}>
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <List className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Table of Contents</span>
          </div>
          <ChevronRight
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isExpanded && "rotate-90"
            )}
          />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <ul className="mt-4 space-y-1">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <button
                      onClick={() => scrollToHeading(heading.id)}
                      className={cn(
                        "text-left w-full text-sm py-1.5 px-2 rounded-lg transition-all",
                        "hover:bg-muted hover:text-foreground",
                        heading.level === 1 && "pl-2 font-medium",
                        heading.level === 2 && "pl-4",
                        heading.level === 3 && "pl-6 text-muted-foreground",
                        activeId === heading.id
                          ? "bg-primary/10 text-primary border-l-2 border-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      <span className="line-clamp-1">{heading.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogTableOfContents;
