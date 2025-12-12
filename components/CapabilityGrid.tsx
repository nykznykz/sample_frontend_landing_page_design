import React from 'react';
import { AssetBrain, AssetGraph, AssetCrypto, AssetFace, AssetEmail, AssetDoc } from './CapabilityAssets';

interface CapabilityGridProps {
  visible: boolean;
}

const items = [
    { title: "Agentic AI Risk Review", Component: AssetBrain, delay: 0 },
    { title: "Behavioral Anomaly Detection", Component: AssetGraph, delay: 100 },
    { title: "On-Chain Forensics", Component: AssetCrypto, delay: 200 },
    { title: "Computer Vision", Component: AssetFace, delay: 300 },
    { title: "Suspicious Email Registration", Component: AssetEmail, delay: 400 },
    { title: "Campaign Abuse AI", Component: AssetDoc, delay: 500 },
];

const CapabilityGrid: React.FC<CapabilityGridProps> = ({ visible }) => {
  return (
    <div 
        className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-1000 ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-10'}`}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl px-6 w-full">
         {items.map((item, i) => (
             <div 
                key={i}
                className="group relative h-40 md:h-52 bg-surface/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-accent/50 transition-colors duration-500"
                style={{
                    transitionDelay: `${item.delay}ms`,
                    transform: visible ? 'scale(1)' : 'scale(0.9)',
                    opacity: visible ? 1 : 0
                }}
             >
                 {/* Inner Glow */}
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 
                 {/* Asset Container */}
                 <div className="absolute inset-0 p-8 opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out">
                     <item.Component active={visible} />
                 </div>
                 
                 {/* Label */}
                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                     <span className="text-xs md:text-sm font-mono text-white/70 uppercase tracking-wider group-hover:text-white transition-colors">
                         {item.title}
                     </span>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
};

export default CapabilityGrid;