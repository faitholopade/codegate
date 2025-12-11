import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Shield, Mic, GraduationCap, Brain, Zap, Target, Users, Rocket, CheckCircle, Code, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Slide {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  bg?: string;
}

const slides: Slide[] = [
  {
    title: "Code Gatekeeper",
    subtitle: "If you can't explain it, you can't ship it.",
    bg: "from-primary/20 via-background to-accent/20",
    content: (
      <div className="flex flex-col items-center gap-8">
        <div className="p-6 rounded-2xl bg-primary/20 border border-primary/30">
          <Shield className="w-24 h-24 text-primary" />
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl text-center">
          A voice-powered AI that quizzes developers on their code before allowing them to ship it — ensuring understanding, not just copy-paste.
        </p>
        <div className="flex gap-4 mt-4">
          <div className="px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium">ElevenLabs</div>
          <div className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium">Claude AI</div>
          <div className="px-4 py-2 rounded-full bg-success/20 text-success text-sm font-medium">Clerk Auth</div>
        </div>
      </div>
    ),
  },
  {
    title: "The Problem",
    subtitle: "AI-generated code is everywhere. Understanding is not.",
    bg: "from-destructive/10 via-background to-warning/10",
    content: (
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-destructive" />
              Copy-Paste Culture
            </h3>
            <p className="text-muted-foreground">Developers ship AI-generated code without understanding what it does</p>
          </div>
          <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-warning" />
              Knowledge Gaps
            </h3>
            <p className="text-muted-foreground">Junior devs miss learning opportunities when AI does all the thinking</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-muted border border-border">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Code Review Bottleneck
            </h3>
            <p className="text-muted-foreground">Senior engineers spend hours explaining code in reviews</p>
          </div>
          <div className="p-4 rounded-xl bg-muted border border-border">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Technical Debt
            </h3>
            <p className="text-muted-foreground">Bugs pile up when no one truly understands the codebase</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Our Solution",
    subtitle: "Two conversational AI agents that teach and test",
    bg: "from-primary/10 via-background to-success/10",
    content: (
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Voice Quiz Agent</h3>
              <p className="text-sm text-muted-foreground">The Gatekeeper</p>
            </div>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
              Asks targeted questions about your code
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
              Listens and assesses your verbal answers
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
              Gives real-time feedback: "Correct!" or "Not quite..."
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
              Only allows shipping if you pass
            </li>
          </ul>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent/20">
              <GraduationCap className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Voice Tutor Agent</h3>
              <p className="text-sm text-muted-foreground">The Teacher</p>
            </div>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
              Extracts topics from your code automatically
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
              Delivers voice lectures on each concept
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
              Uses your actual code as teaching examples
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
              Interactive Q&A after each lesson
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "How It Works",
    subtitle: "The complete learning loop",
    bg: "from-accent/10 via-background to-primary/10",
    content: (
      <div className="flex flex-col items-center gap-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          {[
            { icon: MessageSquare, label: "1. Describe Feature", desc: "Type or speak what you want to build" },
            { icon: Code, label: "2. AI Generates Code", desc: "Claude creates implementation with quiz questions" },
            { icon: Mic, label: "3. Voice Quiz", desc: "ElevenLabs agent tests your understanding" },
            { icon: Rocket, label: "4. Ship or Learn", desc: "Pass = ship it. Fail = tutor teaches you" },
          ].map((step, i) => (
            <div key={i} className="p-4 rounded-xl bg-card border border-border text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold text-sm mb-1">{step.label}</h4>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-success/10 border border-success/20 max-w-2xl">
          <p className="text-center text-success font-medium">
            "If you can explain it, you understand it. If you understand it, you can debug it."
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Technical Architecture",
    subtitle: "Built with sponsor technologies",
    bg: "from-muted via-background to-muted",
    content: (
      <div className="max-w-4xl space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "ElevenLabs", role: "Conversational AI Agents", highlight: true },
            { name: "Claude AI", role: "Code generation & quiz creation", highlight: false },
            { name: "Clerk", role: "User authentication", highlight: true },
            { name: "React + Vite", role: "Frontend framework", highlight: false },
          ].map((tech, i) => (
            <div key={i} className={cn(
              "p-4 rounded-xl border text-center",
              tech.highlight ? "bg-primary/10 border-primary/30" : "bg-card border-border"
            )}>
              <h4 className={cn("font-bold", tech.highlight && "text-primary")}>{tech.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{tech.role}</p>
            </div>
          ))}
        </div>
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="font-bold mb-4">Key ElevenLabs Integration</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-muted">
              <strong>Conversational Agents</strong>
              <p className="text-muted-foreground text-xs mt-1">Real-time voice-to-voice interaction with dynamic prompts</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <strong>Session Overrides</strong>
              <p className="text-muted-foreground text-xs mt-1">Inject code context and questions at runtime</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <strong>Transcript Events</strong>
              <p className="text-muted-foreground text-xs mt-1">Parse responses for scoring and feedback</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Live Demo",
    subtitle: "Let's see it in action",
    bg: "from-primary/20 via-background to-accent/20",
    content: (
      <div className="flex flex-col items-center gap-8">
        <div className="p-8 rounded-2xl bg-card border-2 border-primary/30 border-dashed">
          <div className="text-center space-y-4">
            <div className="text-6xl">🎤</div>
            <h3 className="text-2xl font-bold">Interactive Demo</h3>
            <p className="text-muted-foreground max-w-md">
              Generate code → Take the voice quiz → Learn from the tutor
            </p>
            <Button variant="glow" size="lg" onClick={() => window.location.href = '/'}>
              Open Code Gatekeeper
            </Button>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Impact & Vision",
    subtitle: "Transforming how developers learn",
    bg: "from-success/10 via-background to-primary/10",
    content: (
      <div className="max-w-4xl space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-6 rounded-xl bg-card border border-border text-center">
            <div className="text-4xl font-bold text-primary mb-2">10x</div>
            <p className="text-sm text-muted-foreground">Faster code comprehension through voice interaction</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border text-center">
            <div className="text-4xl font-bold text-accent mb-2">Zero</div>
            <p className="text-sm text-muted-foreground">Copy-paste shipping without understanding</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border text-center">
            <div className="text-4xl font-bold text-success mb-2">∞</div>
            <p className="text-sm text-muted-foreground">Learning opportunities from every code generation</p>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
          <h3 className="font-bold text-lg mb-3">Future Roadmap</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Team leaderboards & knowledge graphs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>IDE integration (VS Code, Cursor)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Custom quiz templates per company</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Multi-language voice support</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Thank You!",
    subtitle: "Questions?",
    bg: "from-primary/20 via-background to-accent/20",
    content: (
      <div className="flex flex-col items-center gap-8">
        <div className="p-6 rounded-2xl bg-primary/20 border border-primary/30">
          <Shield className="w-20 h-20 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-bold text-gradient">Code Gatekeeper</h3>
          <p className="text-xl text-muted-foreground">If you can't explain it, you can't ship it.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 rounded-xl bg-card border border-border text-center">
            <p className="text-sm text-muted-foreground">Built with</p>
            <p className="font-bold">ElevenLabs + Claude + Clerk</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">ElevenLabs Worldwide Hackathon 2025</p>
      </div>
    ),
  },
];

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  const slide = slides[currentSlide];

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col bg-gradient-to-br transition-all duration-500",
        slide.bg || "from-background to-muted"
      )}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      }}
      tabIndex={0}
    >
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="font-bold">Code Gatekeeper</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {currentSlide + 1} / {slides.length}
        </div>
      </header>

      {/* Slide Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{slide.title}</h1>
          {slide.subtitle && (
            <p className="text-xl text-muted-foreground">{slide.subtitle}</p>
          )}
        </div>
        <div className="w-full max-w-5xl flex justify-center">
          {slide.content}
        </div>
      </main>

      {/* Navigation */}
      <footer className="p-4 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === currentSlide ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </footer>
    </div>
  );
}
