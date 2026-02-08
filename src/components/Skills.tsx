import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Badge } from "@/components/ui/badge";
import { Code2, FileCode, Cpu, Terminal } from "lucide-react";

const knownSkills = [
  { name: "HTML", icon: Code2, level: 80 },
  { name: "CSS", icon: FileCode, level: 70 },
  { name: "C Language", icon: Cpu, level: 65 },
];

const learningSkills = [
  { name: "Python", icon: Terminal, level: 30 },
];

const SkillCard = ({
  name,
  icon: Icon,
  level,
  learning,
}: {
  name: string;
  icon: typeof Code2;
  level: number;
  learning?: boolean;
}) => (
  <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all hover:-translate-y-1 group">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon size={20} className="text-accent-foreground group-hover:text-primary-foreground" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{name}</h3>
        {learning && (
          <Badge variant="secondary" className="text-xs mt-1">
            Currently Learning
          </Badge>
        )}
      </div>
    </div>
    <div className="w-full bg-secondary rounded-full h-2">
      <div
        className="bg-primary h-2 rounded-full transition-all duration-1000"
        style={{ width: `${level}%` }}
      />
    </div>
    <p className="text-xs text-muted-foreground mt-2">{level}%</p>
  </div>
);

const Skills = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="skills" className="py-24 px-4 bg-muted/30">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
          Skills
        </h2>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-12" />

        <div className="mb-10">
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-6 font-medium">
            Known Technologies
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {knownSkills.map((skill) => (
              <SkillCard key={skill.name} {...skill} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-6 font-medium">
            Currently Learning
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningSkills.map((skill) => (
              <SkillCard key={skill.name} {...skill} learning />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
