import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Clock } from "lucide-react";
import { usePublishedSyllabus } from "@/hooks/useSyllabus";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SyllabusSection = () => {
  const { data: topics = [], isLoading } = usePublishedSyllabus();

  const courseTypes = [
    { key: "general", label: "Core Concepts" },
    { key: "online", label: "Online Course" },
    { key: "offline", label: "Offline Course" },
    { key: "live", label: "Live Market Training" },
  ];

  const getTopicsByCourse = (courseType: string) =>
    topics.filter((t) => t.course_type === courseType);

  return (
    <section id="syllabus" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Course Curriculum
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            What You'll <span className="text-gradient">Learn</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our comprehensive syllabus covers everything from basics to advanced
            trading strategies, designed by industry experts.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading syllabus...</p>
          </div>
        ) : topics.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Syllabus content coming soon!
            </p>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {courseTypes.map((course, courseIndex) => {
              const courseTopics = getTopicsByCourse(course.key);
              if (courseTopics.length === 0) return null;

              return (
                <motion.div
                  key={course.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: courseIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl border border-border overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {course.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {courseTopics.length} topics
                    </p>
                  </div>

                  <Accordion type="single" collapsible className="px-6">
                    {courseTopics.map((topic, index) => (
                      <AccordionItem key={topic.id} value={topic.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-4 text-left">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-medium text-foreground">
                                {topic.title}
                              </p>
                              {topic.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {topic.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-12 pb-4">
                            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                              {topic.content}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 btn-hero text-lg px-8 py-4"
          >
            Enroll Now
            <ChevronRight className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SyllabusSection;
