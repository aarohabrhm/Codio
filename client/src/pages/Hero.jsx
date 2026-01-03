import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code2, 
  Sparkles, 
  Zap, 
  Users, 
  FolderTree, 
  Play, 
  Globe, 
  ChevronRight,
  ArrowRight,
  Check,
  Terminal,
  Layers,
  Star,
  Github,
  Twitter,
  Linkedin,
  FileText,
} from 'lucide-react';
import codioLogo from '../assets/logo.png';

// Navigation
const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="max-w-5xl mx-auto px-6 py-3 rounded-2xl transition-all duration-300 border bg-[#0a0a0a]/90 backdrop-blur-xl border-gray-800/60 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50 border flex items-center justify-center">
              <img src={codioLogo} alt="Codio" className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white">Codio</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Docs</a>
            
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/login')}
              className="hidden sm:block px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-2 bg-white hover:bg-gray-100 text-black"
            >
              Get Started
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

// Hero Section
const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden">
      {/* Grid background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
             linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      {/* Radial fade overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 20%, #050505 80%)',
        }}
      />
      {/* Spotlight glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-3xl bg-gray-800/30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-gray-700/20" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl bg-gray-700/20" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 backdrop-blur-sm rounded-full border bg-gray-900/50 border-gray-700/50">
          <Sparkles size={14} className="text-gray-300" />
          <span className="text-sm text-gray-300">Now with AI-Powered Assistance</span>
          <ChevronRight size={14} className="text-gray-500" />
        </div>
        
        {/* Main headline */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-b from-gray-300 via-gray-100 to-gray-500 bg-clip-text text-transparent">
          Code, Build & Deploy<br />
          <span className="bg-gradient-to-b from-gray-300 via-gray-100 to-gray-500 bg-clip-text text-transparent">
            Directly in Your Browser
          </span>
        </h1>
        
        <p className="text-lg md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed text-gray-400">
          A browser-based development platform to create projects, manage files, write and run code, and collaborate in real time. No setup required.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-4 font-semibold rounded-xl transition-all flex items-center gap-2 shadow-xl bg-gradient-to-b from-gray-300 via-gray-100 to-gray-500  hover:bg-gray-100 text-black "
          >
            Start Coding Free
            <ArrowRight size={18} />
          </button>
          <button className="px-8 py-4 font-medium rounded-xl border transition-all flex items-center gap-2 bg-[#0a0a0a] hover:bg-[#111111] text-gray-300 border-gray-800/60">
            <FileText size={18}  className="text-gray-300" />
            Explore Docs
          </button>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-center gap-12 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">10K+</div>
            <div className="text-sm text-gray-500">Active Users</div>
          </div>
          <div  />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">50K+</div>
            <div className="text-sm text-gray-500">Projects Created</div>
          </div>
          <div />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">99.9%</div>
            <div className="text-sm text-gray-500">Uptime</div>
          </div>
        </div>
        
        {/* Editor Preview */}
        <div className="relative rounded-2xl overflow-hidden border backdrop-blur-xl shadow-2xl border-gray-800/60 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
          {/* Window header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-[#080808] border-gray-800/60">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0f0f0f]">
              <Code2 size={12} className="text-gray-500" />
              <span className="text-xs text-gray-400">main.js</span>
            </div>
            <div className="w-16" />
          </div>
          
          {/* Code preview */}
          <div className="p-5 font-mono text-sm text-left">
            <pre className="text-gray-300">
              <span className="text-purple-400">const</span> <span className="text-cyan-400">greeting</span> = <span className="text-orange-300">"Hello, Codio!"</span>;{'\n'}
              <span className="text-purple-400">const</span> <span className="text-cyan-400">features</span> = [{'\n'}
              {"  "}<span className="text-orange-300">"AI Assistance"</span>,{'\n'}
              {"  "}<span className="text-orange-300">"Real-time Collaboration"</span>,{'\n'}
              {"  "}<span className="text-orange-300">"Multi-language Support"</span>{'\n'}
              ];{'\n\n'}
              <span className="text-gray-500">// Start building amazing projects</span>{'\n'}
              <span className="text-yellow-400">console</span>.<span className="text-blue-400">log</span>(greeting);
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: Code2,
      title: "Powerful Code Editor",
      description: "Monaco-powered editor with syntax highlighting, IntelliSense, and multi-language support.",
    },
    {
      icon: Sparkles,
      title: "AI Assistance",
      description: "Get intelligent code suggestions, explanations, and debugging help powered by AI.",
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Work together with your team in real-time. See changes instantly as they happen.",
    },
    {
      icon: FolderTree,
      title: "File Management",
      description: "Create, organize, and manage your project files with an intuitive file tree.",
    },
    {
      icon: Play,
      title: "Run Code Instantly",
      description: "Execute your code directly in the browser with support for multiple languages.",
    },
    {
      icon: Globe,
      title: "Access Anywhere",
      description: "Work from any device with a browser. Your projects are always accessible.",
    },
  ];

  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-xs border bg-gray-800/60 text-gray-200 border-gray-700/60">
            <Zap size={12} />
            Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Everything You Need to Code
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-400">
            A complete development environment with all the tools you need to build, test and deploy your applications.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden bg-gradient-to-b from-gray-800/40 to-[#0a0a0a] border-gray-800/60"
            >
              {/* Spotlight effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 70% 30%, rgba(107,114,128,0.18) 0%, transparent 50%)',
                }}
              />
              {/* Grid in spotlight */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
                     linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                  maskImage: 'radial-gradient(circle at 70% 30%, black 0%, transparent 50%)',
                  WebkitMaskImage: 'radial-gradient(circle at 70% 30%, black 0%, transparent 50%)',
                }}
              />
              {/* Enhanced spotlight on hover */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at 70% 30%, rgba(107,114,128,0.28) 0%, transparent 50%)',
                }}
              />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-700/40 rounded-xl flex items-center justify-center mb-4 ">
                  <feature.icon className="text-gray-200" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Quickstart Section
const QuickstartSection = () => {
  const [activeTab, setActiveTab] = useState('javascript');
  
  const codeSnippets = {
    javascript: `// Create a new project
const project = await codio.createProject({
  name: "my-awesome-app",
  template: "react"
});

// Add files to your project
await project.addFile("index.js", \`
  console.log("Hello, Codio!");
\`);

// Run your code instantly
const output = await project.run();
console.log(output);`,
    python: `# Create a new project
project = codio.create_project(
    name="my-awesome-app",
    template="python"
)

# Add files to your project
project.add_file("main.py", """
    print("Hello, Codio!")
""")

# Run your code instantly
output = project.run()
print(output)`,
    typescript: `// Create a new project with TypeScript
const project = await codio.createProject({
  name: "my-awesome-app",
  template: "typescript"
});

// Add typed files to your project
await project.addFile("index.ts", \`
  const greeting: string = "Hello, Codio!";
  console.log(greeting);
\`);

// Run with type checking
const output = await project.run();`
  };

  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/20 to-transparent" />
      {/* Spotlight glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl bg-gray-700/15 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-xs border bg-gray-900/80 text-gray-200 border-gray-700/60">
              Quickstart
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
              Getting started <br />just got easier.
            </h2>
            <p className="text-lg mb-8 leading-relaxed text-gray-400">
              Start coding in seconds with just a few clicks. No complex setup, no configuration headaches. Codio handles the environment, so you can focus on building great software.
            </p>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-gradient-to-br from-gray-800/100 to-gray-900/60 hover:from-gray-700 hover:to-gray-900 text-white font-semibold rounded-xl transition-all flex items-center gap-2">
                Start coding
                <ArrowRight size={16} />
              </button>
              <button className="px-6 py-3 font-medium rounded-xl border transition-all bg-[#0a0a0a] hover:bg-[#111111] text-gray-300 border-gray-800/60">
                Explore Docs
              </button>
            </div>
          </div>
          
          {/* Right side - Code window */}
          <div className="rounded-2xl overflow-hidden border border-gray-800/60 bg-[#050505]">
            {/* Tab bar */}
            <div className="flex items-center border-b border-gray-800">
              {['javascript', 'python', 'typescript'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium transition-all ${
                    activeTab === tab 
                      ? 'text-gray-100 border-b-2 border-gray-400 bg-[#0a0a0a]'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
              <div className="flex-1" />
              <button className="p-3 transition-colors text-gray-500 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            
            {/* Code content */}
            <div className="p-6 font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap text-gray-300">
                {codeSnippets[activeTab].split('\n').map((line, i) => (
                  <div key={i} className="leading-relaxed">
                    {line.startsWith('//') || line.startsWith('#') ? (
                      <span className="text-gray-500">{line}</span>
                    ) : line.includes('const ') || line.includes('await ') ? (
                      <span>
                        <span className="text-purple-400">{line.match(/^(\s*)(const|let|var|await)/)?.[0]}</span>
                        <span className="text-gray-300">{line.replace(/^(\s*)(const|let|var|await)/, '')}</span>
                      </span>
                    ) : line.includes('console.log') || line.includes('print') ? (
                      <span>
                        <span className="text-yellow-400">{line.match(/(console|print)/)?.[0]}</span>
                        <span className="text-gray-300">{line.replace(/(console|print)/, '')}</span>
                      </span>
                    ) : line.includes('"') || line.includes("'") ? (
                      <span>
                        {line.split(/("[^"]*"|'[^']*')/).map((part, j) => 
                          part.startsWith('"') || part.startsWith("'") 
                            ? <span key={j} className="text-orange-300">{part}</span>
                            : <span key={j}>{part}</span>
                        )}
                      </span>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Built For Developers Section
const BuiltForSection = () => {
  const cards = [
    {
      title: "Smart File Management",
      description: "Organize your projects with an intuitive file tree. Create, rename, and manage files effortlessly with drag-and-drop support.",
      link: "Learn about file management →",
      illustration: (
        <div className="relative h-40 flex items-center justify-center">
          <div className="left-2 relative w-16 h-16 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/40 border border-gray-700/60 flex items-center justify-center -translate-x-8 -translate-y-4">
            <FolderTree size={24} className="text-gray-200" />
          </div>
          <div className="absolute h-10 w-10 top-4 right-36 px-3 py-2.5 rounded-lg text-xs bg-[#0a0a0a] border border-gray-800/60 text-gray-400">
            <Code2 size={16} className="text-gray-400" />
          </div>
          <div className="absolute h-10 w-10  bottom-8 left-24 px-3 py-2.5 rounded-lg text-xs bg-[#0a0a0a] border border-gray-800/60 text-gray-400">
            <Terminal size={16} className="text-gray-400" />
          </div>
          
        </div>
      ),
    },
    {
      title: "AI-Powered Assistance",
      description: "Get intelligent code suggestions, explanations, and debugging help. Our AI understands your context and helps you code faster.",
      link: "Explore AI features →",
      illustration: (
        <div className="relative h-40 flex items-center justify-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/40 border border-gray-700/60 flex items-center justify-center">
            <Sparkles size={32} className="text-gray-200" />
          </div>
          <div className="absolute top-4 right-12 px-3 py-1.5 rounded-lg text-xs bg-[#0a0a0a] border border-gray-800/60 text-gray-400">
            Suggestion
          </div>
          <div className="absolute bottom-5 left-6 px-3 py-1.5 rounded-lg text-xs bg-[#0a0a0a] border border-gray-800/60 text-gray-400">
            Autocomplete
          </div>
        </div>
      ),
    },
    {
      title: "Real-time Collaboration",
      description: "Work together with your team in real-time. See changes instantly, share cursors, and communicate through integrated chat.",
      link: "Learn about collaboration →",
      illustration: (
        <div className="relative h-40 flex items-center justify-center">
          <div className="relative w-32 h-32">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-transparent border border-gray-800 flex items-center justify-center text-white text-xs font-bold ">A</div>
            <div className="absolute top-20 -left-6 w-10 h-10 rounded-full bg-transparent border border-gray-800 flex items-center justify-center text-white text-xs font-bold">B</div>
            <div className="absolute top-20 -right-6 w-10 h-10 rounded-full bg-transparent border border-gray-800 flex items-center justify-center text-white text-xs font-bold">C</div>
            <div className="absolute top-20 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl flex items-center justify-center bg-[#0a0a0a] border border-gray-800/60">
              <Users size={20} className="text-gray-400" />
            </div>
            <svg className="relative inset-0 w-full h-full top-5" style={{ zIndex: -1 }}>
              {/* Center to A */}
              <line
                x1="50%"
                y1="45%"
                x2="50%"
                y2="8%"
                stroke="#374151"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              {/* Center to B */}
              <line
                x1="45%"
                y1="55%"
                x2="15%"
                y2="62%"
                stroke="#374151"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              {/* Center to C */}
              <line
                x1="55%"
                y1="55%"
                x2="85%"
                y2="62%"
                stroke="#374151"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
            </svg>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-xs border bg-gray-800/60 text-gray-200 border-gray-700/60">
            Built for Developers
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Built for every developer
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-400">
            Codio delivers a powerful, plug-and-play development environment that adapts to your workflow. Code anywhere, collaborate seamlessly, and ship faster with zero compromise.
          </p>
        </div>
        
        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div 
              key={index}
              className="group relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden bg-[#0a0a0a] border-gray-800/60"
            >
              {/* Subtle spotlight */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 70% 30%, rgba(107,114,128,0.08) 0%, transparent 50%)',
                }}
              />
              {/* Grid in spotlight */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                     linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                  maskImage: 'radial-gradient(circle at 70% 30%, black 0%, transparent 50%)',
                  WebkitMaskImage: 'radial-gradient(circle at 70% 30%, black 0%, transparent 50%)',
                }}
              />
              <div className="relative z-10">
                <div className="mb-6 rounded-xl overflow-hidden bg-gradient-to-b from-gray-900/50 to-transparent">
                  {card.illustration}
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-white">{card.title}</h3>
                <p className="text-sm leading-relaxed mb-4 text-gray-400">{card.description}</p>
                <a href="#" className="text-sm transition-colors text-gray-300 hover:text-white">
                  {card.link}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Create a Project",
      description: "Start a new project in seconds. Choose from templates or start from scratch.",
      icon: FolderTree,
    },
    {
      number: "02",
      title: "Write Your Code",
      description: "Use our powerful editor with AI assistance and live suggestions.",
      icon: Code2,
    },
    {
      number: "03",
      title: "Run & Test",
      description: "Execute your code instantly and see results in real-time.",
      icon: Play,
    },
    {
      number: "04",
      title: "Collaborate & Share",
      description: "Invite team members and work together in real-time.",
      icon: Users,
    },
  ];

  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/20 to-transparent" />
      {/* Spotlight glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-3xl bg-gray-700/15 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-xs border bg-gray-800/60 text-gray-200 border-gray-700/60">
            <Layers size={12} />
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Start Building in Minutes
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-400">
            Get up and running quickly with our intuitive workflow.
          </p>
        </div>
        
        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
                            
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl border mb-6 bg-gradient-to-b from-gray-800/40 to-gray-900/40 border-gray-800/60">
                  <step.icon size={32} className="text-gray-200" />
                </div>
                <div className="text-xs font-mono mb-2 text-gray-300">{step.number}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Languages Section
const LanguagesSection = () => {
  const languages = [
    { name: "JavaScript", color: "#9ca3af" },
    { name: "TypeScript", color: "#9ca3af" },
    { name: "Python", color: "#9ca3af" },
    { name: "Java", color: "#9ca3af" },
    { name: "C++", color: "#9ca3af" },
    { name: "Go", color: "#9ca3af" },
    { name: "Rust", color: "#9ca3af" },
    { name: "Ruby", color: "#9ca3af" },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Multi-Language Support</h2>
          <p className="text-gray-400">Write code in your favorite programming language</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {languages.map((lang, index) => (
            <div 
              key={index}
              className="px-6 py-3 rounded-xl border transition-all flex items-center gap-3 bg-[#0a0a0a] border-gray-800/60 hover:border-gray-700"
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: lang.color }}
              />
              <span className="font-medium text-gray-300">{lang.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Section
const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "3 Projects",
        "Basic AI assistance",
        "Community support",
        "1GB storage",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$12",
      period: "/month",
      description: "For professional developers",
      features: [
        "Unlimited projects",
        "Advanced AI features",
        "Priority support",
        "10GB storage",
        "Real-time collaboration",
        "Custom themes",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Team",
      price: "$29",
      period: "/user/month",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team management",
        "Admin controls",
        "100GB storage",
        "SSO integration",
        "Dedicated support",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-xs border bg-gray-800/60 text-gray-200 border-gray-700/60">
            <Star size={12} />
            Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-400">
            Choose the plan that's right for you. Start free, upgrade when you need.
          </p>
        </div>
        
        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`group relative p-8 rounded-2xl border transition-all overflow-hidden ${
                plan.popular 
                  ? 'bg-gradient-to-b from-gray-800/40 to-[#0a0a0a] border-gray-700/60'
                  : 'bg-[#0a0a0a] border-gray-800/60 hover:border-gray-700'
              }`}
            >
              {/* Subtle spotlight */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 70% 30%, rgba(107,114,128,0.08) 0%, transparent 50%)',
                }}
              />
              {/* Grid in spotlight */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                     linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                  maskImage: 'radial-gradient(circle at 70% 30%, black 0%, transparent 50%)',
                  WebkitMaskImage: 'radial-gradient(circle at 70% 30%, black 0%, transparent 50%)',
                }}
              />
              {/* Enhanced spotlight on hover */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at 70% 30%, rgba(107,114,128,0.15) 0%, transparent 50%)',
                }}
              />
              
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-200 text-gray-900 text-xs font-semibold rounded-full z-10">
                  Most Popular
                </div>
              )}
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-400">{plan.period}</span>}
                </div>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <Check size={16} className="text-gray-200 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 rounded-xl font-medium transition-all mt-auto ${
                  plan.popular 
                    ? 'bg-white hover:bg-gray-100 text-black'
                    : 'bg-[#0a0a0a] hover:bg-[#111111] text-gray-300 border border-gray-800/60'
                }`}>
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/20 to-transparent" />
      {/* Spotlight glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full blur-3xl bg-gray-700/20 pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="relative p-12 rounded-3xl border overflow-hidden bg-gradient-to-b from-gray-900/60 to-[#0a0a0a] border-gray-800/60">
          {/* Subtle spotlight */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 70% 30%, rgba(107,114,128,0.18) 0%, transparent 50%)',
            }}
          />
          {/* Grid in spotlight */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
              maskImage: 'radial-gradient(circle at 70% 30%, black 0%, transparent 50%)',
              WebkitMaskImage: 'radial-gradient(circle at 70% 30%, black 0%, transparent 50%)',
            }}
          />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Start Building?
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto text-gray-400">
              Join thousands of developers who are already building amazing projects with Codio.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 font-semibold rounded-xl transition-all flex items-center gap-2 mx-auto shadow-xl bg-white hover:bg-gray-100 text-black shadow-white/10"
            >
              Get Started for Free
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50">
                <img src={codioLogo} alt="Codio" className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white">Codio</span>
            </div>
            <p className="text-sm mb-4 text-gray-400">
              The modern development platform for building and deploying applications.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg transition-colors bg-[#0a0a0a] hover:bg-[#111111]">
                <Github size={18} className="text-gray-400" />
              </a>
              <a href="#" className="p-2 rounded-lg transition-colors bg-[#0a0a0a] hover:bg-[#111111]">
                <Twitter size={18} className="text-gray-400" />
              </a>
              <a href="#" className="p-2 rounded-lg transition-colors bg-[#0a0a0a] hover:bg-[#111111]">
                <Linkedin size={18} className="text-gray-400" />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm transition-colors text-gray-400 hover:text-white">Features</a></li>
              <li><a href="#pricing" className="text-sm transition-colors text-gray-400 hover:text-white">Pricing</a></li>
              <li><a href="#" className="text-sm transition-colors text-gray-400 hover:text-white">Documentation</a></li>
              <li><a href="#" className="text-sm transition-colors text-gray-400 hover:text-white">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm transition-colors text-gray-400 hover:text-white">About</a></li>
              <li><a href="#" className="text-sm transition-colors text-gray-400 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-sm transition-colors text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-sm transition-colors text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm transition-colors text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-sm transition-colors text-gray-400 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-sm transition-colors text-gray-400 hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 border-gray-800">
          <p className="text-sm text-gray-500">© 2026 Codio. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
            <span className="text-sm text-gray-400">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Hero Component
export default function Hero() {
  return (
    <div className="min-h-screen relative bg-[#050505] text-white">
      {/* Global spotlight effect */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(55,65,81,0.4) 0%, transparent 50%)' }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 70% 20%, rgba(75,85,99,0.15) 0%, transparent 40%)' }} />
      
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <QuickstartSection />
      <BuiltForSection />
      <HowItWorksSection />
      <LanguagesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
