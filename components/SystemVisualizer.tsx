import React, { useEffect, useRef } from 'react';
import { RealWorldInterface } from './RealWorldInterface';
import FeatureSpotlight from './FeatureSpotlight';
import { CapabilityCanvas } from './CapabilityCanvas';
import { AlertTriangle } from 'lucide-react';
import anime from 'animejs';

interface SystemVisualizerProps {
  phase: number;
  progress: number;
}

// --- SUB-COMPONENTS ---

// Particle Flow Canvas using Anime.js for Phase 4
const FlowCanvas: React.FC<{ active: boolean }> = ({ active }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<any>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize
        const setSize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        setSize();
        window.addEventListener('resize', setSize);

        // Particle System
        const particleCount = 200;
        const particles: any[] = [];
        
        for(let i=0; i<particleCount; i++) {
            particles.push({
                progress: Math.random(), // 0 to 1
                speed: 0.001 + Math.random() * 0.002,
                offset: (Math.random() - 0.5) * 40, // Random width scatter
                size: Math.random() * 2 + 1
            });
        }

        if (active) {
            const getPos = (t: number, w: number, h: number) => {
                const p0 = {x: 0, y: h/2};
                const p1 = {x: w*0.3, y: h*0.1};
                const p2 = {x: w*0.7, y: h*0.9};
                const p3 = {x: w, y: h/2};
                
                const cx = 3 * (p1.x - p0.x);
                const bx = 3 * (p2.x - p1.x) - cx;
                const ax = p3.x - p0.x - cx - bx;
                
                const cy = 3 * (p1.y - p0.y);
                const by = 3 * (p2.y - p1.y) - cy;
                const ay = p3.y - p0.y - cy - by;
                
                const x = (ax * Math.pow(t, 3)) + (bx * Math.pow(t, 2)) + (cx * t) + p0.x;
                const y = (ay * Math.pow(t, 3)) + (by * Math.pow(t, 2)) + (cy * t) + p0.y;
                
                return { x, y };
            }

            const render = () => {
                if (!canvas) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach(p => {
                    p.progress += p.speed;
                    if(p.progress > 1) p.progress = 0;

                    const pos = getPos(p.progress, canvas.width, canvas.height);
                    
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y + p.offset, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${1 - Math.abs(p.progress - 0.5) * 1.5})`; 
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.moveTo(pos.x - 10, pos.y + p.offset);
                    ctx.lineTo(pos.x, pos.y + p.offset);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${1 - Math.abs(p.progress - 0.5)})`;
                    ctx.stroke();
                });

                animationRef.current = requestAnimationFrame(render);
            };

            render();
        }

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', setSize);
        };
    }, [active]);

    return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`} />;
}

// 1. The Circuit Pane
const CircuitPane: React.FC<{ index: number; phase: number; progress: number; chaosFactor: number }> = ({ 
    index, phase, progress, chaosFactor 
}) => {
    
    const layers = [
        { 
            color: 'text-white/10', 
            path: "M10 10 H 90 V 90 H 10 Z",
            detail: "M15 15 H 85 V 85 H 15 Z M10 50 H 90 M50 10 V 90" 
        },
        { 
            color: 'text-accent/20', 
            path: "M30 30 H 70 V 70 H 30 Z",
            detail: "M35 35 H 65 V 65 H 35 Z M50 35 V 65 M35 50 H 65"
        },
        { 
            color: 'text-white/20', 
            path: "M10 10 L 30 30 M90 10 L 70 30 M90 90 L 70 70 M10 90 L 30 70",
            detail: "M50 0 V 20 M50 80 V 100 M0 50 H 20 M80 50 H 100"
        },
        { 
            color: 'text-accent/30', 
            path: "M50 10 L 90 50 L 50 90 L 10 50 Z",
            detail: "M50 20 L 80 50 L 50 80 L 20 50 Z"
        },
        { 
            color: 'text-white/15', 
            path: "M20 20 H 40 V 80 H 20 Z M60 20 H 80 V 80 H 60 Z",
            detail: "M25 25 H 35 M25 35 H 35 M25 45 H 35 M65 25 H 75 M65 35 H 75"
        },
        { 
            color: 'text-white/40', 
            path: "M0 0 H 10 V 10 H 0 Z M90 0 H 100 V 10 H 90 Z M0 90 H 10 V 100 H 0 Z M90 90 H 100 V 100 H 90 Z",
            detail: "M45 5 H 55 M95 45 V 55 M55 95 H 45 M5 55 V 45"
        },
    ];

    const layerData = layers[index % layers.length];
    
    // Determine visibility and position
    // If phase >= 5, we are in the "Capabilities" sequence, so the stack should fly UP and fade out.
    // However, if we are in phase 11 (Real World), it's also past.
    // If we are in phases 0-4, it's active.
    
    const isPast = phase >= 5;
    
    // Transform Logic
    let transform = '';
    let opacity = isPast ? 0 : 0.1 + (index * 0.12);
    
    const bgOpacity = phase === 1 ? 'bg-accent/10' : 'bg-accent/5';

    if (isPast) {
        // Fly up and scale down slightly
        transform = `translate3d(0, -100vh, ${-index * 20}px) scale(0.8)`;
    } else if (phase === 1) { // Chaos
        const scatterX = (index % 2 === 0 ? 1 : -1) * (index * 70 + 30) * chaosFactor;
        const scatterY = (index % 3 === 0 ? -1 : 1) * (index * 50 + 20) * chaosFactor;
        const scatterZ = index * 40 * chaosFactor;
        const rotateX = (index % 3 === 0 ? 20 : -20) * chaosFactor;
        const rotateY = (index * 15) * chaosFactor;
        transform = `translate3d(${scatterX}px, ${scatterY}px, ${scatterZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    } else if (phase === 2) { // Snap - Alignment
         const ease = 1 - progress;
         const scatterX = (index % 2 === 0 ? 1 : -1) * (index * 70) * ease;
         const scatterY = (index % 3 === 0 ? -1 : 1) * (index * 50) * ease;
         transform = `translate3d(${scatterX}px, ${scatterY}px, ${index * 30 * ease}px) scale(${1 - (index * 0.05)})`;
    } else { // Idle
        transform = `translateZ(${-index * 20}px) scale(${1 - (index * 0.05)})`;
    }

    return (
        <div
            className={`absolute inset-0 border border-white/10 ${bgOpacity} backdrop-blur-[1px] transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] shadow-[0_0_30px_rgba(0,0,0,0.5)] group`}
            style={{
                transform,
                opacity,
                zIndex: 10 - index,
                borderRadius: '12px',
                boxShadow: phase >= 3 && phase < 5 ? '0 0 20px rgba(59, 130, 246, 0.2)' : 'none'
            }}
        >
            <svg className="w-full h-full p-4 overflow-visible" viewBox="0 0 100 100">
                <path d={layerData.path} className={`${layerData.color} transition-colors duration-500`} fill="none" stroke="currentColor" strokeWidth="0.5" />
                <path d={layerData.detail} className="text-white/10" fill="none" stroke="currentColor" strokeWidth="0.2" />
                {phase >= 3 && phase < 5 && (
                     <circle cx="50" cy="50" r="1" fill="white" className="animate-pulse" />
                )}
            </svg>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-xl pointer-events-none" />
        </div>
    );
};

// 2. Data Debris
const DebrisShard: React.FC<{ index: number; chaosFactor: number }> = ({ index, chaosFactor }) => {
    const rX = (index * 137) % 100 - 50; 
    const rY = (index * 263) % 100 - 50; 
    const rZ = (index * 91) % 200 - 100;
    const rotate = (index * 45) % 360;
    const type = index % 4;
    const opacity = chaosFactor > 0.05 ? Math.min(1, chaosFactor * 1.5) : 0;
    const x = rX * 5 * chaosFactor;
    const y = rY * 5 * chaosFactor;
    const z = rZ * 2 * chaosFactor;

    return (
        <div 
            className="absolute flex items-center justify-center pointer-events-none transition-transform duration-100 ease-linear will-change-transform"
            style={{
                transform: `translate3d(${x}vw, ${y}vh, ${z}px) rotate(${rotate + (chaosFactor * 90)}deg)`,
                opacity: opacity
            }}
        >
            <div className={`
                relative p-2 border backdrop-blur-md shadow-xl overflow-hidden
                ${type === 2 ? 'bg-danger/10 border-danger/30' : 'bg-surface/40 border-white/10'}
            `}
            style={{
                width: `${40 + (index % 3) * 20}px`,
                height: `${30 + (index % 2) * 20}px`,
                clipPath: index % 2 === 0 ? 'polygon(10% 0, 100% 0, 100% 80%, 0 100%)' : 'polygon(0 0, 90% 0, 100% 100%, 10% 90%)'
            }}
            >
                {type === 0 && (
                    <div className="space-y-1">
                        <div className="h-1 w-full bg-white/20 rounded-full" />
                        <div className="h-1 w-2/3 bg-white/20 rounded-full" />
                    </div>
                )}
                {type === 2 && (
                    <div className="flex items-center justify-center h-full text-danger">
                        <AlertTriangle size={12} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-scan" style={{ animationDuration: '1s' }} />
            </div>
        </div>
    );
};

// 4. Scanner Array
const ScannerArray: React.FC<{ active: boolean }> = ({ active }) => {
    return (
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-accent shadow-[0_0_20px_#3B82F6] animate-scan" />
            <div className="absolute inset-0 bg-grid-pattern opacity-10 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
            <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-accent/50" />
            <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-accent/50" />
            <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-accent/50" />
            <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-accent/50" />
        </div>
    );
}

// 5. AnimeJS Background Grid
const AnimeBackground: React.FC<{ phase: number }> = ({ phase }) => {
    const gridRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (!gridRef.current) return;
        
        // Setup simple dots
        const dots = [];
        const cols = 8;
        const rows = 8;
        for (let i = 0; i < cols * rows; i++) {
             const dot = document.createElement('div');
             dot.className = 'absolute w-1 h-1 bg-white/10 rounded-full';
             dot.style.left = `${(i % cols) * (100 / cols) + 5}%`;
             dot.style.top = `${Math.floor(i / rows) * (100 / rows) + 5}%`;
             gridRef.current.appendChild(dot);
             dots.push(dot);
        }
        
        const animation = (anime as any)({
            targets: dots,
            scale: [
                { value: .1, easing: 'easeOutSine', duration: 500 },
                { value: 1, easing: 'easeInOutQuad', duration: 1200 }
            ],
            opacity: [0.1, 0.4],
            delay: (anime as any).stagger(200, { grid: [cols, rows], from: 'center' }),
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutQuad'
        });

        return () => {
             animation.pause();
             if (gridRef.current) gridRef.current.innerHTML = '';
        }
    }, []);

    return <div ref={gridRef} className="absolute inset-0 w-full h-full opacity-30" />;
}

export default function SystemVisualizer({ phase, progress }: SystemVisualizerProps) {
  
  const chaosFactor = phase === 1 ? progress : phase === 2 ? 1 - progress : 0;
  const isAlignmentPhase = phase === 2;
  const showFlow = phase === 4;
  const showReal = phase === 11;

  const bgColor = showReal ? '#050505' : '#020202';

  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none perspective-[1200px] overflow-hidden">
      
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 transition-colors duration-1000 ease-in-out"
        style={{ backgroundColor: bgColor }} 
      />
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent transition-opacity duration-1000 ${phase > 0 && phase < 11 ? 'opacity-100' : 'opacity-0'}`} />

      {/* AnimeJS Grid Background */}
      {phase >= 0 && phase < 11 && <AnimeBackground phase={phase} />}
      
      {/* Flow Canvas for Phase 4 */}
      <FlowCanvas active={showFlow} />

      {/* Capability Canvas for Phases 5-10 */}
      <CapabilityCanvas phase={phase} />

      {/* 2. Debris Field (Only in early phases) */}
      <div className={`absolute inset-0 flex items-center justify-center preserve-3d transition-opacity duration-500 ${phase >= 5 ? 'opacity-0' : 'opacity-100'}`}>
         {[...Array(20)].map((_, i) => (
             <DebrisShard key={i} index={i} chaosFactor={chaosFactor} />
         ))}
      </div>

      {/* 4. Scanner Overlay */}
      <ScannerArray active={isAlignmentPhase} />

      {/* 1. The Core System (The Stack) - Fades out/Flies up at phase 5 */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 preserve-3d">
         {[0, 1, 2, 3, 4, 5].map((i) => (
             <CircuitPane 
                key={i} 
                index={i} 
                phase={phase} 
                progress={progress} 
                chaosFactor={chaosFactor} 
             />
         ))}
         
         <div 
             className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent rounded-full blur-[80px] transition-all duration-1000`}
             style={{ 
                 width: phase === 1 ? '150px' : '100px',
                 height: phase === 1 ? '150px' : '100px',
                 opacity: phase >= 5 ? 0 : (phase === 1 ? 0.3 : 0.1),
             }}
         />
      </div>

      {/* 6. Feature Spotlight (Phases 5-10) */}
      <FeatureSpotlight phase={phase} />

      {/* 7. Real World Interface (Phase 11) */}
      <RealWorldInterface visible={showReal} />
      
    </div>
  );
};