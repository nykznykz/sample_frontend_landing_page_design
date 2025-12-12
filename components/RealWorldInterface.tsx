import React from 'react';
import { Activity, Shield, Users, Globe, Lock, CheckCircle } from 'lucide-react';

export const RealWorldInterface: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <div 
      className={`absolute w-[90vw] md:w-[800px] h-[500px] bg-surface/90 border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] backdrop-blur-xl
      ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95 pointer-events-none'}`}
    >
        {/* Top Bar */}
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/5">
            <div className="flex items-center gap-4">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="h-4 w-px bg-white/10 mx-2"></div>
                <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                    <Lock size={12} />
                    <span>SECURE_CONNECTION_V4</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                 <div className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-[10px] text-green-400 font-mono tracking-wider">
                     SYSTEM OPTIMAL
                 </div>
            </div>
        </div>

        {/* Dashboard Grid */}
        <div className="flex-1 p-6 grid grid-cols-12 gap-6 relative">
            
            {/* Background Grid Lines */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

            {/* Sidebar Stats */}
            <div className="col-span-4 flex flex-col gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/5 flex flex-col gap-2 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
                    <div className="flex items-center justify-between text-white/50 text-xs uppercase tracking-wider">
                        <span>Threat Level</span>
                        <Shield size={14} />
                    </div>
                    <div className="text-2xl font-display font-bold text-white">Low</div>
                    <div className="text-xs text-white/30">0.001% anomaly rate</div>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/5 flex flex-col gap-2">
                     <div className="flex items-center justify-between text-white/50 text-xs uppercase tracking-wider">
                        <span>Active Sessions</span>
                        <Users size={14} />
                    </div>
                    <div className="text-2xl font-display font-bold text-white">842,091</div>
                    <div className="text-xs text-green-400 flex items-center gap-1">
                        <Activity size={10} /> +12% this hour
                    </div>
                </div>

                <div className="flex-1 rounded-lg bg-gradient-to-br from-accent/10 to-transparent border border-accent/10 p-4 flex flex-col justify-end relative overflow-hidden">
                     {/* Decorative Globe-ish circles */}
                     <div className="absolute -right-10 -top-10 w-32 h-32 border border-accent/20 rounded-full"></div>
                     <div className="absolute -right-6 -top-6 w-24 h-24 border border-accent/20 rounded-full"></div>
                     
                     <div className="relative z-10">
                        <div className="text-accent text-xs font-mono mb-1">GLOBAL COVERAGE</div>
                        <div className="text-white text-sm">Monitoring 142 regions</div>
                     </div>
                </div>
            </div>

            {/* Main Chart Area */}
            <div className="col-span-8 bg-black/20 rounded-lg border border-white/5 p-6 relative">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Transaction Volume</div>
                        <div className="text-3xl font-display font-bold">2.4M/s</div>
                    </div>
                    <div className="flex gap-2">
                        {['1H', '24H', '7D'].map((t, i) => (
                            <div key={t} className={`px-2 py-1 rounded text-[10px] font-mono cursor-pointer ${i === 0 ? 'bg-white/10 text-white' : 'text-white/30'}`}>
                                {t}
                            </div>
                        ))}
                    </div>
                </div>

                {/* SVG Chart */}
                <div className="relative h-48 w-full">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                        <defs>
                            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2"/>
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                        <path 
                            d="M0,80 C50,80 50,40 100,60 C150,80 150,20 200,40 C250,60 250,30 300,50 C350,70 350,10 400,30" 
                            fill="url(#chartFill)" 
                        />
                        <path 
                            d="M0,80 C50,80 50,40 100,60 C150,80 150,20 200,40 C250,60 250,30 300,50 C350,70 350,10 400,30" 
                            fill="none" 
                            stroke="#3B82F6" 
                            strokeWidth="2" 
                            vectorEffect="non-scaling-stroke"
                        />
                        {/* Scanning Line */}
                        <line x1="200" y1="0" x2="200" y2="100" stroke="white" strokeOpacity="0.1" strokeDasharray="4 4" />
                        <circle cx="200" cy="40" r="4" fill="white" className="animate-pulse" />
                    </svg>
                </div>
                
                {/* Status Bar */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/30">
                     <span>LATENCY: 12ms</span>
                     <span>ENCRYPTION: AES-256</span>
                     <span className="flex items-center gap-1 text-green-500"><CheckCircle size={10} /> VERIFIED</span>
                </div>
            </div>
        </div>
    </div>
  );
};