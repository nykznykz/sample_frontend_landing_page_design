import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

interface JitterCloudProps {
  phase: number;
}

const THREATS = [
  "Synthetic ID", "Account Takeover", "Bot Farm", "Credential Stuffing",
  "Proxy Network", "Device Spoofing", "GPS Mocking", "Emulator",
  "Man-in-the-Browser", "Click Farm", "Social Engineering", "SIM Swap",
  "Velocity Abuse", "Layer 7 Attack", "IP Hopping", "Cookie Replay",
  "Brute Force", "Token Theft", "Session Hijacking", "API Abuse"
];

const JitterCloud: React.FC<JitterCloudProps> = ({ phase }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const active = phase === 1; // Only active in Chaos phase

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear previous styles/animations if needed or handle via anime.remove
    const elements = containerRef.current.children;
    (anime as any).remove(elements);

    if (active) {
        // 1. Entrance Animation: Staggered Fade In + Scale Up
        (anime as any)({
            targets: elements,
            opacity: [0, 1],
            scale: [0.5, 1],
            duration: 800,
            delay: (anime as any).stagger(50, { from: 'center' }),
            easing: 'easeOutBack'
        });

        // 2. Continuous Jitter Loop
        // We randomly assign different jitter parameters to each element
        Array.from(elements).forEach((el) => {
            (anime as any)({
                targets: el,
                translateX: () => (anime as any).random(-30, 30),
                translateY: () => (anime as any).random(-30, 30),
                rotate: () => (anime as any).random(-10, 10),
                duration: () => (anime as any).random(1500, 3000),
                delay: () => (anime as any).random(0, 500),
                direction: 'alternate',
                loop: true,
                easing: 'easeInOutQuad'
            });
        });

    } else {
        // 3. Exit Animation: "Clarify" - suck into the center or fade out rapidly
        (anime as any)({
            targets: elements,
            opacity: 0,
            scale: 0.2,
            translateX: 0,
            translateY: 0,
            rotate: 0,
            duration: 500,
            easing: 'easeInExpo',
            delay: (anime as any).stagger(10, { from: 'center', direction: 'reverse' })
        });
    }
  }, [active]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {THREATS.map((threat, i) => (
        <div
          key={i}
          className="absolute whitespace-nowrap px-4 py-2 rounded-full border border-red-500/20 bg-black/80 backdrop-blur-sm text-red-400/60 text-sm font-mono tracking-tight"
          style={{
            // Initial positioning: Random scatter, biased towards center slightly
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            opacity: 0, // Controlled by anime
            willChange: 'transform, opacity'
          }}
        >
          <span className="text-red-500 mr-2 opacity-50">⚠</span>
          {threat}
        </div>
      ))}
    </div>
  );
};

export default JitterCloud;