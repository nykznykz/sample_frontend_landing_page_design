import React, { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import SystemVisualizer from './components/SystemVisualizer';
import StoryStage from './components/StoryStage';
import JitterCloud from './components/JitterCloud';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ArrowDown, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  useLenis();

  // Phase controls the Visualizer's state
  // 0: Thesis (Idle)
  // 1: Fragmentation (Chaos / Friction)
  // 2: Alignment (Snap)
  // 3: Perception (Transparent)
  // 4: Flow (Reasoning)
  // 5-10: Capabilities (Spotlight)
  // 11: Real World (Artifact)
  const [phase, setPhase] = useState(0);
  
  // Progress within the current active section (0-1) for smooth animations
  const [progress, setProgress] = useState(0);

  return (
    <div className="bg-background min-h-screen text-white selection:bg-white/20">
      
      <Navbar />

      {/* BACKGROUND LAYER - STICKY VISUALIZER */}
      <SystemVisualizer phase={phase} progress={progress} />
      
      {/* BACKGROUND LAYER - JITTER CLOUD (CHAOS) */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${phase === 1 ? 'z-20' : 'z-0'}`}>
        <JitterCloud phase={phase} />
      </div>

      {/* FOREGROUND LAYER - SCROLL SCRIPT */}
      <main className="relative z-10">
        
        {/* ACT I: ARRIVAL */}
        <StoryStage 
            id="hero" 
            className="h-[120vh]"
            onEnter={() => setPhase(0)} 
            onProgress={(p) => setProgress(p)}
        >
          <div className="max-w-4xl mx-auto text-center space-y-12 pt-20">
             <div className="inline-block animate-pulse-subtle">
                 <span className="text-xs font-mono tracking-[0.3em] text-secondary uppercase border border-white/10 px-3 py-1 rounded-full">Sentinel System v3.0</span>
             </div>
             <h1 className="text-6xl md:text-9xl font-display font-bold leading-[0.9] tracking-tighter mix-blend-difference">
                 Complex systems<br/>don't fail.
             </h1>
             <p className="text-xl md:text-2xl text-secondary font-light max-w-2xl mx-auto">
                 Understanding does. Sentinel transforms data chaos into defensive clarity.
             </p>
          </div>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center opacity-40 animate-bounce">
              <span className="text-[10px] uppercase tracking-widest block mb-2">Initialize</span>
              <ArrowDown className="mx-auto w-4 h-4" />
          </div>
        </StoryStage>

        {/* ACT II: FRICTION (CHAOS) */}
        <StoryStage 
            id="chaos" 
            className="h-[150vh]" // Taller to allow time for the chaos animation
            onEnter={() => setPhase(1)} 
            onProgress={(p) => setProgress(p)}
        >
             <div className="max-w-xl ml-auto mr-12 text-right relative z-30">
                 <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Signals everywhere.<br/>Insight nowhere.</h2>
                 <p className="text-lg text-secondary leading-relaxed bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/5 inline-block">
                     Modern fraud detection isn't about lack of data. It's about data density. 
                     Fragments of identity scattered across thousands of logs.
                 </p>
             </div>
        </StoryStage>

        {/* INTERSTITIAL: FAILED ATTEMPTS */}
        <StoryStage 
            id="failed" 
            className="h-[80vh]"
            onEnter={() => setPhase(1)} // Stay in chaos
            onProgress={(p) => setProgress(p)}
        >
             <div className="max-w-lg mx-auto text-center opacity-60 relative z-30">
                 <p className="text-sm font-mono text-danger mb-4">SYSTEM ALERT</p>
                 <h3 className="text-2xl font-display">More dashboards didn't help.</h3>
             </div>
        </StoryStage>

        {/* ACT III: ALIGNMENT */}
        <StoryStage 
            id="alignment" 
            className="h-[100vh]"
            onEnter={() => setPhase(2)} 
            onProgress={(p) => setProgress(p)}
        >
             <div className="max-w-3xl mx-auto text-center">
                 <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">What if the system<br/>explained itself?</h2>
             </div>
        </StoryStage>

        {/* ACT IV: CAPABILITY 1 (PERCEPTION) */}
        <StoryStage 
            id="perception" 
            className="h-[120vh]"
            onEnter={() => setPhase(3)} 
            onProgress={(p) => setProgress(p)}
        >
             <div className="max-w-md mr-auto ml-12">
                 <div className="w-12 h-px bg-white mb-6" />
                 <h3 className="text-3xl font-display font-bold mb-4">See the whole.</h3>
                 <p className="text-secondary leading-relaxed">
                     Sentinel renders the entire user lifecycle as a single, continuous object. 
                     No more tab switching. No more mental compilation.
                 </p>
             </div>
        </StoryStage>

        {/* ACT IV: CAPABILITY 2 (REASONING/FLOW) */}
        <StoryStage 
            id="reasoning" 
            className="h-[120vh]"
            onEnter={() => setPhase(4)} 
            onProgress={(p) => setProgress(p)}
        >
             <div className="max-w-md ml-auto mr-12 text-right">
                 <div className="w-12 h-px bg-white mb-6 ml-auto" />
                 <h3 className="text-3xl font-display font-bold mb-4">Noise becomes structure.</h3>
                 <p className="text-secondary leading-relaxed">
                     Behavioral paths converge into clear outcomes. 
                     We don't just flag anomalies; we trace their origin.
                 </p>
             </div>
        </StoryStage>

        {/* ACT V: DETAILED CAPABILITIES SERIES - USER JOURNEY: SIGNUP -> TRADING -> WITHDRAWAL */}
        
        {/* --- SIGNUP PHASE --- */}

        {/* Capability: Biometric (Identity) - Phase 8 */}
        <StoryStage 
            id="cap-bio" 
            className="h-[120vh]"
            onEnter={() => setPhase(8)} 
            onProgress={(p) => setProgress(p)}
        >
             <div className="max-w-lg mr-auto ml-12 md:ml-24 bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl relative z-20 shadow-2xl transition-all duration-500 hover:border-purple-400/30">
                 <span className="text-purple-400 font-mono text-xs tracking-wider uppercase mb-4 block">01 / Signup / Identity</span>
                 <h3 className="text-4xl font-display font-bold mb-6">Computer Vision.</h3>
                 <p className="text-lg text-secondary leading-relaxed">
                     We scan users at the door. Identifying fake KYC documents or bot farms using identical photos across thousands of accounts.
                 </p>
             </div>
        </StoryStage>

        {/* Capability: Email (Security) - Phase 9 */}
        <StoryStage 
            id="cap-phish" 
            className="h-[120vh]"
            onEnter={() => setPhase(9)} 
            onProgress={(p) => setProgress(p)}
        >
             <div className="max-w-lg ml-auto mr-12 md:mr-24 text-right bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl relative z-20 shadow-2xl transition-all duration-500 hover:border-green-400/30">
                 <span className="text-green-400 font-mono text-xs tracking-wider uppercase mb-4 block">02 / Signup / Security</span>
                 <h3 className="text-4xl font-display font-bold mb-6">Synthetic Pattern Analysis.</h3>
                 <p className="text-lg text-secondary leading-relaxed">
                     Flag accounts registered with gibberish emails or throwaway domains. We analyze linguistic entropy to spot synthetic sign-up waves before they trade.
                 </p>
             </div>
        </StoryStage>

        {/* --- TRADING PHASE --- */}

        {/* Capability: Brain (Agents) - Phase 5 - THE AI INVESTIGATORS */}
        <StoryStage 
            id="cap-ai" 
            className="h-[120vh]"
            onEnter={() => setPhase(5)} 
            onProgress={(p) => setProgress(p)}
        >
             <div className="max-w-xl mr-auto ml-12 md:ml-24 bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl relative z-20 shadow-2xl transition-all duration-500 hover:border-accent/30">
                 <span className="text-accent font-mono text-xs tracking-wider uppercase mb-4 block">03 / Trading / Intelligence</span>
                 <h3 className="text-4xl font-display font-bold mb-6">AI Investigator Swarm.</h3>
                 <p className="text-lg text-secondary leading-relaxed">
                     A coordinated team of AI agents combs through tick-level trading history. They autonomously identify complex patterns like <span className="text-white">Hedging</span>, <span className="text-white">Gap Trading</span>, and <span className="text-white">Market Manipulation</span> in real-time.
                 </p>
             </div>
        </StoryStage>

        {/* Capability: Graph (Anomaly) - Phase 6 */}
        <StoryStage 
            id="cap-anomaly" 
            className="h-[120vh]"
            onEnter={() => setPhase(6)} 
            onProgress={(p) => setProgress(p)}
        >
             <div className="max-w-lg ml-auto mr-12 md:mr-24 text-right bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl relative z-20 shadow-2xl transition-all duration-500 hover:border-danger/30">
                 <span className="text-danger font-mono text-xs tracking-wider uppercase mb-4 block">04 / Trading / Anomalies</span>
                 <h3 className="text-4xl font-display font-bold mb-6">Behavioral Sequencing.</h3>
                 <p className="text-lg text-secondary leading-relaxed">
                     Detect suspicious sequences instantly: rapid deposits, followed by meaningless churning trades, and immediate withdrawal requests.
                 </p>
             </div>
        </StoryStage>

        {/* --- WITHDRAWAL PHASE --- */}

        {/* Capability: Crypto - Phase 7 */}
        <StoryStage 
            id="cap-crypto" 
            className="h-[120vh]"
            onEnter={() => setPhase(7)} 
            onProgress={(p) => setProgress(p)}
        >
             <div className="max-w-lg mr-auto ml-12 md:ml-24 bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl relative z-20 shadow-2xl transition-all duration-500 hover:border-yellow-400/30">
                 <span className="text-yellow-400 font-mono text-xs tracking-wider uppercase mb-4 block">05 / Withdrawal / Blockchain</span>
                 <h3 className="text-4xl font-display font-bold mb-6">On-Chain Forensics.</h3>
                 <p className="text-lg text-secondary leading-relaxed">
                     We catch toxic client groups that aggregate funds via deep on-chain flow analysis, preventing bad actors from exiting the system.
                 </p>
             </div>
        </StoryStage>

        {/* Capability: Doc - Phase 10 */}
        <StoryStage 
            id="cap-compliance" 
            className="h-[120vh]"
            onEnter={() => setPhase(10)} 
            onProgress={(p) => setProgress(p)}
        >
             <div className="max-w-lg ml-auto mr-12 md:mr-24 text-right bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl relative z-20 shadow-2xl transition-all duration-500 hover:border-white/30">
                 <span className="text-white font-mono text-xs tracking-wider uppercase mb-4 block">06 / Governance</span>
                 <h3 className="text-4xl font-display font-bold mb-6">Campaign Vulnerability.</h3>
                 <p className="text-lg text-secondary leading-relaxed">
                     AI screens your promotional campaign rules to identify potential vectors of exploitation and suggests refinements before launch.
                 </p>
             </div>
        </StoryStage>

        {/* ACT VI: REAL WORLD */}
        <StoryStage 
            id="real-world" 
            className="h-[100vh]"
            onEnter={() => setPhase(11)} 
            onProgress={(p) => setProgress(p)}
        >
             <div className="max-w-2xl mx-auto text-center pt-96">
                 <h2 className="text-4xl font-display font-bold mb-6">Built for real teams.</h2>
                 <p className="text-secondary mb-8">
                     Translating abstract intelligence into decisive action.
                 </p>
                 <button className="group px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center gap-2 mx-auto">
                     Start Integration
                     <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
             </div>
        </StoryStage>

        <Footer />

      </main>
    </div>
  );
};

export default App;