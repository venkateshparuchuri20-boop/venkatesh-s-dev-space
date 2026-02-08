import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Personal Portfolio Website",
    description:
      "A simple, responsive portfolio website to showcase my skills and projects. Built from scratch as my first web development project.",
    tech: ["HTML", "CSS"],
    github: "#",
    demo: "#",
  },
  {
    title: "Basic Calculator",
    description:
      "A beginner-level calculator application that performs basic arithmetic operations. Great practice for programming logic.",
    tech: ["C Language"],
    github: "#",
    demo: "#",
  },
  {
    title: "Learning Project",
    description:
      "A project showcasing my learning progress in programming. Includes various exercises and small programs built while studying.",
    tech: ["Python", "HTML"],
    github: "#",
    demo: "#",
  },
];

const Projects = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="projects" className="py-24 px-4">
      <div
        ref={ref}
        className={`max-w-5xl mx-auto transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
          Projects
        </h2>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-12" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="bg-card rounded-xl border border-border p-6 flex flex-col hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tech.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-3">
                <Button size="sm" variant="outline" asChild className="gap-1.5 flex-1">
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github size={14} />
                    GitHub
                  </a>
                </Button>
                <Button size="sm" asChild className="gap-1.5 flex-1">
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
