import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BlogReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Calculate how far through the article we've scrolled
      const start = articleTop;
      const end = articleTop + articleHeight - windowHeight;
      const current = scrollY;

      if (current <= start) {
        setProgress(0);
      } else if (current >= end) {
        setProgress(100);
      } else {
        const progressPercent = ((current - start) / (end - start)) * 100;
        setProgress(Math.min(100, Math.max(0, progressPercent)));
      }
    };

    calculateProgress();
    window.addEventListener("scroll", calculateProgress);
    window.addEventListener("resize", calculateProgress);

    return () => {
      window.removeEventListener("scroll", calculateProgress);
      window.removeEventListener("resize", calculateProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-accent"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1, ease: "linear" }}
      />
    </div>
  );
};

export default BlogReadingProgress;
