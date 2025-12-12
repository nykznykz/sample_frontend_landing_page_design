import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

// --- TYPES ---
export interface AssetProps {
    active: boolean;
}

// --- SHARED STYLES ---
const STROKE_COLOR = "stroke-current text-current";
const ACCENT_COLOR = "stroke-current text-current";

// --- ANIMATION HOOK ---
const useAnimeEntrance = (active: boolean) => {
    const scope = useRef<SVGSVGElement>(null);
    const tl = useRef<any>(null);

    useEffect(() => {
        if (!scope.current) return;

        // Reset state
        if (!active) {
            (anime as any).set(scope.current.querySelectorAll('path, line:not(.ignore-entrance), circle, rect, polyline'), {
                opacity: 0
            });
            return;
        }

        // Init timeline
        tl.current = (anime as any).timeline({
            easing: 'easeOutExpo',
            duration: 1500
        });

        // Select elements but exclude those marked to ignore (like our custom scan line)
        const elements = scope.current.querySelectorAll('path, line:not(.ignore-entrance), rect, polyline');
        const circles = scope.current.querySelectorAll('circle');

        // 1. Set initial dashoffset for line drawing effect
        (anime as any).set(elements, {
            strokeDashoffset: (anime as any).setDashoffset,
            opacity: 1 // Make visible but hidden by dashoffset
        });
        
        (anime as any).set(circles, {
            scale: 0,
            opacity: 0
        });

        // 2. Draw lines
        if (elements.length > 0) {
            tl.current.add({
                targets: elements,
                strokeDashoffset: [(anime as any).setDashoffset, 0],
                opacity: { value: 1, duration: 100 },
                delay: (anime as any).stagger(50), // Stagger the drawing
                duration: 2000,
                easing: 'easeInOutQuart'
            });
        }

        // 3. Pop in circles/nodes
        if (circles.length > 0) {
            tl.current.add({
                targets: circles,
                scale: [0, 1],
                opacity: [0, 1],
                delay: (anime as any).stagger(100),
                duration: 800,
                easing: 'spring(1, 80, 10, 0)' // Spring physics
            }, '-=1500'); // Overlap with line drawing
        }

    }, [active]);

    return scope;
};

// --- ASSETS ---

// Rebranded as the "AI Investigator Swarm"
export const AssetBrain: React.FC<AssetProps> = ({ active }) => {
  const scope = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!scope.current) return;
    
    // Cleanup
    (anime as any).remove(scope.current.querySelectorAll('*'));

    if (active) {
        // 1. Entrance Sequence
        (anime as any).timeline({ easing: 'easeOutExpo' })
            .add({
                targets: scope.current.querySelector('.central-hub'),
                scale: [0, 1],
                opacity: [0, 1],
                duration: 800
            })
            .add({
                targets: scope.current.querySelectorAll('.investigator-node'),
                scale: [0, 1],
                opacity: [0, 1],
                duration: 600,
                delay: (anime as any).stagger(100)
            }, '-=400')
            .add({
                targets: scope.current.querySelectorAll('.connection-line'),
                strokeDashoffset: [(anime as any).setDashoffset, 0],
                opacity: [0, 1],
                duration: 800
            }, '-=600');

        // 2. Continuous Animation Loop
        // Rotation of the swarm group
        (anime as any)({
            targets: scope.current.querySelector('.swarm-group'),
            rotate: 360,
            transformOrigin: '50px 50px',
            duration: 20000,
            loop: true,
            easing: 'linear'
        });

        // Pulsing of the nodes
        (anime as any)({
            targets: scope.current.querySelectorAll('.investigator-node'),
            r: [3, 4],
            strokeWidth: [1, 2],
            duration: 1000,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
            delay: (anime as any).stagger(300)
        });

        // Scanning Beams (Cones)
        (anime as any)({
             targets: scope.current.querySelectorAll('.scan-cone'),
             opacity: [0.1, 0.4],
             scale: [0.8, 1.2],
             duration: 1500,
             direction: 'alternate',
             loop: true,
             easing: 'easeInOutQuad'
        });

    } else {
         (anime as any)({
            targets: scope.current.querySelectorAll('*'),
            opacity: 0,
            duration: 300,
            easing: 'linear'
        });
    }
  }, [active]);

  return (
    <svg ref={scope} viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      {/* Central Command Hub */}
      <path 
        d="M50 38 L62 45 V55 L50 62 L38 55 V45 Z" 
        className="central-hub fill-accent/20 stroke-accent" 
        strokeWidth="1.5" 
        style={{ opacity: 0, transformOrigin: '50px 50px' }}
      />
      <circle cx="50" cy="50" r="15" className="central-hub stroke-accent/30" fill="none" strokeDasharray="2 2" style={{ transformOrigin: '50px 50px' }} />

      {/* Orbiting Swarm Group */}
      <g className="swarm-group">
          {/* Agent 1 */}
          <g transform="translate(50, 15)">
              <circle className="investigator-node fill-surface stroke-white" r="3" strokeWidth="1" />
              {/* Scan Cone */}
              <path d="M0 0 L-6 -15 H6 Z" className="scan-cone fill-white/20" />
              <line x1="0" y1="0" x2="0" y2="23" className="connection-line stroke-white/20" strokeDasharray="2 2" />
          </g>

          {/* Agent 2 */}
          <g transform="translate(80, 68)">
              <circle className="investigator-node fill-surface stroke-white" r="3" strokeWidth="1" />
              <path d="M0 0 L12 8 L6 18 Z" className="scan-cone fill-white/20" />
              <line x1="0" y1="0" x2="-20" y2="-12" className="connection-line stroke-white/20" strokeDasharray="2 2" />
          </g>

          {/* Agent 3 */}
          <g transform="translate(20, 68)">
              <circle className="investigator-node fill-surface stroke-white" r="3" strokeWidth="1" />
              <path d="M0 0 L-12 8 L-6 18 Z" className="scan-cone fill-white/20" />
              <line x1="0" y1="0" x2="20" y2="-12" className="connection-line stroke-white/20" strokeDasharray="2 2" />
          </g>
      </g>
    </svg>
  );
};

export const AssetGraph: React.FC<AssetProps> = ({ active }) => {
  const scope = useAnimeEntrance(active);

  return (
    <svg ref={scope} viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      {/* Grid */}
      <path d="M10 90 H90" className="stroke-white/10" strokeWidth="0.25" />
      <path d="M10 70 H90" className="stroke-white/10" strokeWidth="0.25" />
      <path d="M10 50 H90" className="stroke-white/10" strokeWidth="0.25" />
      <path d="M10 30 H90" className="stroke-white/10" strokeWidth="0.25" />
      
      <path d="M10 90 V10" className="stroke-white/10" strokeWidth="0.25" />
      <path d="M30 90 V10" className="stroke-white/10" strokeWidth="0.25" />
      <path d="M50 90 V10" className="stroke-white/10" strokeWidth="0.25" />
      <path d="M70 90 V10" className="stroke-white/10" strokeWidth="0.25" />
      <path d="M90 90 V10" className="stroke-white/10" strokeWidth="0.25" />
      
      {/* Normal Line */}
      <path d="M10 80 L 30 75 L 50 78 L 70 72 L 90 76" className="stroke-white/30" fill="none" strokeWidth="0.5" />
      
      {/* Anomaly Line */}
      <path d="M10 60 L 30 55 L 50 20 L 70 58 L 90 52" className="text-danger stroke-current drop-shadow-[0_0_8px_currentColor]" fill="none" strokeWidth="1" />
      
      {/* Alert Blip */}
      <circle cx="50" cy="20" r="2.5" className="fill-danger" />
    </svg>
  );
};

export const AssetCrypto: React.FC<AssetProps> = ({ active }) => {
  const scope = useRef<SVGSVGElement>(null);

  // Define network nodes with varying distances to look like a realistic non-uniform network
  // Center is 50,50
  const networkNodes = [
      { x: 82, y: 25 }, // Far Top-Right (Long)
      { x: 35, y: 15 }, // Far Top-Left (Long)
      { x: 65, y: 85 }, // Far Bottom-Right (Long)
      { x: 15, y: 45 }, // Far Left (Medium)
      { x: 75, y: 55 }, // Mid Right (Short)
      { x: 40, y: 30 }, // Mid Top-Left (Short)
      { x: 60, y: 70 }, // Mid Bottom-Right (Medium)
      { x: 30, y: 65 }, // Mid Bottom-Left (Medium)
  ];

  // Define toxic users - Clustered around peripheral nodes, avoiding the central hub
  const toxicUsers = [
      // Cluster 1: Near initial bad node (20, 80)
      { x: 15, y: 75 }, { x: 25, y: 85 }, { x: 10, y: 82 }, { x: 28, y: 78 },
      
      // Cluster 2: Near Far Left Node (15, 45)
      { x: 12, y: 40 }, { x: 18, y: 48 }, { x: 8, y: 45 }, { x: 15, y: 52 },

      // Cluster 3: Near Far Top-Right Node (82, 25)
      { x: 85, y: 22 }, { x: 79, y: 28 }, { x: 88, y: 25 }, { x: 82, y: 18 },

      // Cluster 4: Near Mid Bottom-Right Node (60, 70)
      { x: 63, y: 73 }, { x: 57, y: 67 }, { x: 64, y: 68 }
  ];

  useEffect(() => {
    if (!scope.current) return;
    
    // Clear existing animations
    const elements = scope.current.querySelectorAll('*');
    (anime as any).remove(elements);

    // Initial State: Hide everything
    const hubAnim = scope.current.querySelector('.hub-anim');
    const initialNodeAnim = scope.current.querySelector('.initial-node-anim');
    const hiddenNodesAnim = scope.current.querySelectorAll('.hidden-node-anim');
    const initialLink = scope.current.querySelector('.initial-link');
    const hiddenLinks = scope.current.querySelectorAll('.hidden-link');
    const toxicIconsAnim = scope.current.querySelectorAll('.toxic-icon-anim');
    const rings = scope.current.querySelectorAll('.hub-ring');

    if (!active) {
        (anime as any).set([hubAnim, initialNodeAnim, hiddenNodesAnim, initialLink, hiddenLinks, toxicIconsAnim, rings], { opacity: 0 });
        return;
    }

    // Prepare styles
    (anime as any).set([initialLink, hiddenLinks], { 
        strokeDashoffset: (anime as any).setDashoffset, 
        opacity: 0 
    });
    (anime as any).set([hubAnim, initialNodeAnim, hiddenNodesAnim, toxicIconsAnim], { 
        scale: 0, 
        opacity: 0 
    });
    (anime as any).set(rings, { opacity: 0, scale: 0.5 });

    const tl = (anime as any).timeline({
        easing: 'easeOutExpo'
    });

    // 1. Reveal Initial Node Only (The Red Starting Point)
    tl.add({
        targets: initialNodeAnim,
        scale: [0, 1],
        opacity: [0, 1],
        duration: 400, // Speed up: 600 -> 400
        easing: 'easeOutBack'
    })
    // 2. Trace Connection to Hub
    .add({
        targets: initialLink,
        strokeDashoffset: [(anime as any).setDashoffset, 0],
        opacity: 1,
        duration: 300, // Speed up: 600 -> 300
        easing: 'easeInOutQuad'
    })
    // 3. Reveal Hub (Central Node)
    .add({
        targets: hubAnim,
        scale: [0, 1],
        opacity: [0, 1],
        duration: 400, // Speed up: 600 -> 400
        easing: 'easeOutBack'
    })
    // 4. Hub Activation (Pulse)
    .add({
        targets: rings,
        opacity: [0, 0.5, 0],
        scale: [1, 2.5],
        duration: 500, // Speed up: 800 -> 500
        easing: 'easeOutSine'
    })
    // 5. Reveal Hidden Network (Links outward, then nodes pop)
    .add({
        targets: hiddenLinks,
        strokeDashoffset: [(anime as any).setDashoffset, 0],
        opacity: 0.6,
        duration: 400, // Speed up: 600 -> 400
        delay: (anime as any).stagger(30), // Speed up: 50 -> 30
        easing: 'easeInOutQuad'
    }, '-=300') // Adjust offset for faster timing
    .add({
        targets: hiddenNodesAnim,
        scale: [0, 1],
        opacity: 1,
        duration: 400, // Speed up: 500 -> 400
        delay: (anime as any).stagger(30, { start: 50 }), // Speed up
        easing: 'easeOutBack'
    }, '-=300') 
    // 6. Reveal Toxic Users
    // Reduce delay significantly to make it punchier
    .add({
        targets: toxicIconsAnim,
        opacity: [0, 1],
        scale: [0, 1],
        duration: 400, // Speed up: 600 -> 400
        easing: 'easeOutElastic(1, .6)',
        delay: (anime as any).stagger(20), // Speed up
        complete: () => {
             // Only start the jitter loop after they have entered
             startToxicJitter();
        }
    }, '+=100'); // Reduce wait time: +=400 -> +=100

    // 7. Continuous Loops
    // Hub Rotation
    (anime as any)({
        targets: scope.current.querySelector('.hub-core'),
        rotate: 360,
        duration: 12000,
        loop: true,
        easing: 'linear'
    });

    // Function to start the jitter loop for toxic icons
    function startToxicJitter() {
        toxicIconsAnim.forEach((icon: any) => {
            (anime as any)({
                targets: icon,
                opacity: [1, 0.7, 1],
                translateX: () => (anime as any).random(-2, 2),
                translateY: () => (anime as any).random(-2, 2),
                scale: [1, 1.1, 1],
                duration: () => (anime as any).random(200, 600),
                direction: 'alternate',
                loop: true,
                easing: 'easeInOutQuad',
                delay: (anime as any).random(0, 500)
            });
        });
    }

  }, [active]);

  return (
    <svg ref={scope} viewBox="0 0 100 100" className="w-full h-full overflow-visible">
       {/* Links Layer */}
       {/* Initial Link: Bottom-Left (20, 80) to Hub (50, 50) */}
       <line x1="20" y1="80" x2="50" y2="50" className="initial-link stroke-yellow-400" strokeWidth="0.8" strokeDasharray="2 1" />
       
       {/* Hidden Links to various points */}
       <g className="hidden-links">
           {networkNodes.map((pos, i) => (
               <line 
                key={i} 
                x1={pos.x} y1={pos.y} 
                x2="50" y2="50" 
                className="hidden-link stroke-white/20" 
                strokeWidth="0.5" 
               />
           ))}
       </g>

       {/* Nodes Layer */}
       
       {/* Hub Node (Center) */}
       <g transform="translate(50, 50)">
            <g className="hub-anim">
                {/* Expansion Rings */}
                <circle r="12" className="hub-ring stroke-yellow-500/30" fill="none" />
                <circle r="12" className="hub-ring stroke-yellow-500/20" fill="none" />
                
                {/* Core */}
                <g className="hub-core">
                    <path d="M-6 0 L-3 -5.2 L3 -5.2 L6 0 L3 5.2 L-3 5.2 Z" className="fill-surface stroke-yellow-400" strokeWidth="1" />
                    <circle r="1.5" className="fill-yellow-400" />
                </g>
            </g>
       </g>

       {/* Initial Bad Node */}
       <g transform="translate(20, 80)">
           <g className="initial-node-anim">
                <circle r="4" className="fill-black stroke-red-500" strokeWidth="1" />
                <path d="M-2 -2 L2 2 M-2 2 L2 -2" className="stroke-red-500" strokeWidth="1" />
           </g>
       </g>

       {/* Hidden Bad Nodes (The Cluster) */}
       {networkNodes.map((pos, i) => (
           <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
               <g className="hidden-node-anim">
                   <circle r="2.5" className="fill-surface stroke-white/40" strokeWidth="1" />
                   <circle r="1" className="fill-white/40" />
               </g>
           </g>
       ))}

       {/* Toxic Icons (Flashing around the network) */}
       {toxicUsers.map((pos, i) => (
           <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
               <g className="toxic-icon-anim">
                   {/* Small 'Bug' icon - slightly larger to be visible */}
                   <path d="M-3 -3 L3 3 M-3 3 L3 -3" className="stroke-red-500" strokeWidth="1.2" />
                   <rect x="-4" y="-4" width="8" height="8" className="stroke-red-500 fill-red-500/20" strokeWidth="0.5" />
               </g>
           </g>
       ))}

    </svg>
  );
};

export const AssetFace: React.FC<AssetProps> = ({ active }) => {
  const scope = useAnimeEntrance(active);
  const scanLineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (!scanLineRef.current) return;

    if (active) {
        // Continuous scanning animation
        (anime as any)({
            targets: scanLineRef.current,
            translateY: [0, 60], // From top (20) to bottom (80)
            opacity: [
                { value: 1, duration: 200, easing: 'linear' },
                { value: 0.6, duration: 800, easing: 'linear' },
                { value: 1, duration: 200, easing: 'linear' }
            ],
            duration: 1500,
            easing: 'easeInOutSine',
            direction: 'alternate',
            loop: true
        });
    } else {
        // Reset
        (anime as any).remove(scanLineRef.current);
        (anime as any).set(scanLineRef.current, { translateY: 0, opacity: 0 });
    }
  }, [active]);

  return (
    <svg ref={scope} viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      {/* Frame */}
      <polyline points="20 30 20 20 30 20" className={ACCENT_COLOR} strokeWidth="1" fill="none" />
      <polyline points="70 20 80 20 80 30" className={ACCENT_COLOR} strokeWidth="1" fill="none" />
      <polyline points="80 70 80 80 70 80" className={ACCENT_COLOR} strokeWidth="1" fill="none" />
      <polyline points="30 80 20 80 20 70" className={ACCENT_COLOR} strokeWidth="1" fill="none" />

      {/* Silhouette */}
      <path d="M50 30 C 40 30, 35 40, 35 50 C 35 65, 40 70, 50 75 C 60 70, 65 65, 65 50 C 65 40, 60 30, 50 30" className="fill-white/5 stroke-white/20" strokeWidth="0.5" />
      
      {/* Scan Line - Handled by Custom Effect */}
      <line 
        ref={scanLineRef}
        x1="15" y1="20" x2="85" y2="20" 
        className="stroke-current drop-shadow-[0_0_8px_currentColor] ignore-entrance" 
        strokeWidth="1.5"
        style={{ opacity: 0 }}
      />
      
      {/* Points */}
      <circle cx="45" cy="45" r="1" className="fill-white" />
      <circle cx="55" cy="45" r="1" className="fill-white" />
      <circle cx="50" cy="55" r="1" className="fill-white" />
      <circle cx="40" cy="50" r="1" className="fill-white" />
      <circle cx="60" cy="50" r="1" className="fill-white" />
    </svg>
  );
};

export const AssetEmail: React.FC<AssetProps> = ({ active }) => {
  const scope = useAnimeEntrance(active);

  return (
    <svg ref={scope} viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      {/* Envelope */}
      <rect x="20" y="35" width="60" height="40" rx="2" className={`${STROKE_COLOR} fill-white/5`} strokeWidth="0.5" />
      <polyline points="20 35 50 55 80 35" className={STROKE_COLOR} strokeWidth="0.5" fill="none" />
      
      {/* Shield Icon Overlay */}
      <path d="M75 60 C 75 60, 85 65, 85 72 C 85 78, 75 82, 75 82 C 75 82, 65 78, 65 72 C 65 65, 75 60, 75 60 Z" className="fill-surface stroke-current" strokeWidth="1" />
      <polyline points="71 70 74 73 79 67" className="stroke-current" fill="none" strokeWidth="1" />
      
      {/* Scanning Grid */}
      <line x1="25" y1="45" x2="55" y2="45" className="stroke-white/10" strokeWidth="0.5" />
      <line x1="25" y1="52" x2="45" y2="52" className="stroke-white/10" strokeWidth="0.5" />
      <line x1="25" y1="59" x2="50" y2="59" className="stroke-white/10" strokeWidth="0.5" />
    </svg>
  );
};

export const AssetDoc: React.FC<AssetProps> = ({ active }) => {
  const scope = useAnimeEntrance(active);

  return (
    <svg ref={scope} viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      {/* Document */}
      <path d="M30 15 H60 L75 30 V85 H30 V15 Z" className={`${STROKE_COLOR} fill-white/5`} strokeWidth="0.5" />
      <polyline points="60 15 60 30 75 30" className={STROKE_COLOR} strokeWidth="0.5" fill="none" />
      
      {/* Text Lines */}
      <line x1="40" y1="30" x2="55" y2="30" className="stroke-white/30" strokeWidth="0.5" />
      <line x1="40" y1="40" x2="65" y2="40" className="stroke-white/30" strokeWidth="0.5" />
      <line x1="40" y1="50" x2="65" y2="50" className="stroke-white/30" strokeWidth="0.5" />
      <line x1="40" y1="60" x2="55" y2="60" className="stroke-white/30" strokeWidth="0.5" />
      <line x1="40" y1="70" x2="65" y2="70" className="stroke-white/30" strokeWidth="0.5" />
      
      {/* Highlight */}
      <rect x="38" y="48" width="30" height="4" className="fill-current/20" />
      
      {/* Magnifying Glass */}
      <circle cx="65" cy="65" r="12" className="stroke-white fill-surface/80" strokeWidth="1" />
      <line x1="74" y1="74" x2="82" y2="82" className="stroke-white" strokeWidth="1.5" />
    </svg>
  );
};