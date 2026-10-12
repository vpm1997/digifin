import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  BellRing, 
  LineChart, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  Menu, 
  X,
  Lock,
  Cpu
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-sm z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-2 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              DigiFin<span className="text-blue-700">Saviour</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-blue-700 font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-blue-700 font-medium transition-colors">How it Works</a>
            <a href="#about" className="text-slate-600 hover:text-blue-700 font-medium transition-colors">About</a>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md">
              Secure Your Account
            </button>
          </nav>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="px-4 pt-2 pb-6 space-y-4 shadow-xl">
            <a href="#features" className="block px-3 py-2 text-slate-600 font-medium">Features</a>
            <a href="#how-it-works" className="block px-3 py-2 text-slate-600 font-medium">How it Works</a>
            <button className="w-full mt-4 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium">
              Secure Your Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 overflow-hidden -z-10 h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/30 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-emerald-300/30 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-900 font-semibold text-sm mb-8 shadow-sm">
            <Cpu className="h-4 w-4" />
            <span>AI-Powered by Anthropic Claude</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
            The Ultimate Guardian for <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-emerald-600">
              Your Financial Health
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            Stop losing money to hidden banking fees, predatory interest rates, and silent credit reporting errors. Let AI automatically audit your accounts and fight back.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2">
              Connect Securely <ArrowRight className="h-5 w-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-sm">
              <Lock className="h-5 w-5 text-slate-400" /> Bank-Grade Encryption
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const featuresData = [
  {
    title: "Hidden Fee Detection",
    description: "Our AI deeply parses your bank's MITC agreements and cross-references them against your statements to spot unwarranted charges.",
    icon: <Search className="h-8 w-8 text-blue-600" />,
    color: "bg-blue-100/50"
  },
  {
    title: "Predictive Warnings",
    description: "Get alerted days in advance before you breach minimum balance thresholds or trigger late payment penalties.",
    icon: <BellRing className="h-8 w-8 text-amber-500" />,
    color: "bg-amber-100/50"
  },
  {
    title: "Bureau Health Audit",
    description: "We compare your actual payments with CIBIL/Experian reports to instantly catch ghost defaults or laggy reporting.",
    icon: <LineChart className="h-8 w-8 text-emerald-600" />,
    color: "bg-emerald-100/50"
  },
  {
    title: "Automated Dispute Resolution",
    description: "Found an error? DigiFinSaviour auto-drafts the exact legal and regulatory letters needed to get your money back.",
    icon: <Scale className="h-8 w-8 text-indigo-600" />,
    color: "bg-indigo-100/50"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6">Unmatched Protection Against Banking Errors</h2>
          <p className="text-lg text-slate-600 font-medium">
            DigiFinSaviour acts as your personal financial advocate, working 24/7 to ensure complete transparency and fairness.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {featuresData.map((feature, index) => (
            <div key={index} className="p-8 rounded-[2rem] border border-slate-100 bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 group">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-800 transition-colors">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      title: "Sync Securely",
      description: "Connect via trusted Account Aggregators or upload your e-statements safely."
    },
    {
      title: "AI Analysis",
      description: "Claude models read the fine print in your bank's contracts and terms."
    },
    {
      title: "Real-time Audit",
      description: "Every transaction is verified for correct interest math and fee validity."
    },
    {
      title: "Take Action",
      description: "Approve auto-drafted escalation emails to resolve disputes instantly."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
         <div className="absolute w-[800px] h-[800px] bg-blue-500 rounded-full blur-[150px] -top-[400px] -right-[200px]"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-6">How DigiFinSaviour Works</h2>
          <p className="text-lg text-slate-300 font-medium">
            Four simple steps to total financial peace of mind.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-full h-[2px] bg-slate-700 group-hover:bg-blue-500 transition-colors"></div>
              )}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-700 group-hover:border-blue-500 flex items-center justify-center text-2xl font-bold mb-6 shadow-xl transition-colors">
                  <span className="text-blue-400">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-slate-900 p-2 rounded-xl">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                DigiFin<span className="text-blue-700">Saviour</span>
              </span>
            </div>
            <p className="text-slate-500 mb-6 max-w-sm font-medium">
              The AI-powered advocate fighting for consumer fairness in banking.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 hover:text-blue-700 font-medium transition-colors">How it Works</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-700 font-medium transition-colors">Security</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-700 font-medium transition-colors">Supported Banks</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 hover:text-blue-700 font-medium transition-colors">Privacy</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-700 font-medium transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} DigiFinSaviour AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Systems Operational
          </div>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <div className="min-h-screen font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default App;