import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { User, BookOpen, Code } from "lucide-react";

const About = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-24 px-4">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
          About Me
        </h2>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-12" />

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-xl border border-border p-6 text-center space-y-3 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto">
              <User className="text-accent-foreground" size={24} />
            </div>
            <h3 className="font-semibold text-foreground">Who I Am</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I'm a first-year student with a passion for technology and a strong
              desire to become a skilled frontend developer.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 text-center space-y-3 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto">
              <BookOpen className="text-accent-foreground" size={24} />
            </div>
            <h3 className="font-semibold text-foreground">What I Love</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I have a strong interest in web development and enjoy learning new
              technologies to build creative and functional websites.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 text-center space-y-3 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto">
              <Code className="text-accent-foreground" size={24} />
            </div>
            <h3 className="font-semibold text-foreground">My Journey</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I currently know HTML, CSS, and C language. I'm actively learning
              Python and expanding my skills every day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
