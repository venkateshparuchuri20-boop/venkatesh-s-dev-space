import { ArrowDown, FolderOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-4 pt-16 relative"
    >
      <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-up">
        <p className="text-primary font-medium tracking-wide uppercase text-sm">
          Hello, I'm
        </p>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
          P. Venkatesh
        </h1>
        <p className="text-xl sm:text-2xl text-muted-foreground font-light">
          Frontend Developer
        </p>
        <p className="text-muted-foreground max-w-lg mx-auto">
          First-year student learning and building web projects
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button size="lg" onClick={() => scrollTo("#projects")} className="gap-2">
            <FolderOpen size={18} />
            View Projects
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollTo("#contact")}
            className="gap-2"
          >
            <Mail size={18} />
            Contact Me
          </Button>
        </div>
      </div>

      <button
        onClick={() => scrollTo("#about")}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ArrowDown size={24} />
      </button>
    </section>
  );
};

export default Hero;
