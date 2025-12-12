import React, { useEffect, useRef } from 'react';

interface CapabilityCanvasProps {
  phase: number;
}

export const CapabilityCanvas: React.FC<CapabilityCanvasProps> = ({ phase }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    let secondaryParticles: any[] = []; // Static Data Nodes
    
    // Resize handler
    const setSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    // Init logic based on phase
    const init = () => {
        particles = [];
        secondaryParticles = [];
        const w = canvas.width;
        const h = canvas.height;
        
        if (phase === 5) { // AI INVESTIGATOR SWARM
             // 1. Static Data Nodes (The "Trade History")
             // Scattered more densely in the center
             for(let i=0; i<60; i++) {
                 const angle = Math.random() * Math.PI * 2;
                 const rad = Math.random() * (Math.min(w,h) * 0.4);
                 secondaryParticles.push({
                     x: (w/2) + Math.cos(angle) * rad,
                     y: (h/2) + Math.sin(angle) * rad,
                     size: Math.random() * 1.5 + 0.5,
                     alpha: 0.1 + Math.random() * 0.3,
                     isRisk: Math.random() > 0.85, // 15% chance of being a risk
                     isScanned: false
                 });
             }
             
             // 2. The Agents (Investigators)
             for(let i=0; i<4; i++) {
                 particles.push({
                     x: Math.random() * w,
                     y: Math.random() * h,
                     tx: Math.random() * w, 
                     ty: Math.random() * h,
                     vx: 0,
                     vy: 0,
                     speed: 3 + Math.random() * 2,
                     scanRadius: 60,
                     state: 'moving', // moving, scanning, alerting
                     scanTimer: 0,
                     targetNode: null
                 });
             }
        } else if (phase === 6) { // Radar (Detection)
             // No particles init needed for radar sweep
        } else if (phase === 7) { // Crypto (Matrix/Hex)
             const columns = Math.floor(w / 14); // Font size approx 14px width
             for(let i=0; i<columns; i++) {
                 particles.push({
                     x: i * 14,
                     y: Math.random() * h,
                     speed: Math.random() * 3 + 2,
                     chars: "0123456789ABCDEF".split(''),
                     len: Math.floor(Math.random() * 10) + 5
                 });
             }
        } else if (phase === 8) { // Identity (3D Sphere)
             for(let i=0; i<500; i++) {
                 const theta = Math.random() * 2 * Math.PI;
                 const phi = Math.acos(2 * Math.random() - 1);
                 const r = 250;
                 particles.push({
                     theta, phi, r,
                     x: 0, y: 0, z: 0
                 });
             }
        } else if (phase === 9) { // Security (Shield)
             for(let i=0; i<80; i++) {
                 particles.push({
                     x: Math.random() * w,
                     y: Math.random() * h,
                     vx: 0,
                     vy: 0,
                     state: 'spawn' // spawn, flying, bouncing
                 });
             }
        } else if (phase === 10) { // Governance (Sorting)
             for(let i=0; i<40; i++) {
                 particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h - h, // Start above
                    w: 10 + Math.random() * 30,
                    h: 10,
                    speed: 1 + Math.random() * 2,
                    type: Math.random() > 0.5 ? 'A' : 'B'
                 });
             }
        }
    };
    
    init();

    let tick = 0;

    const render = () => {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = canvas.width;
        const h = canvas.height;
        const cx = w/2;
        const cy = h/2;
        tick++;

        if (phase === 5) { // AI Swarm Logic
            // Draw Data Nodes
            secondaryParticles.forEach(node => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                
                if (node.isScanned && node.isRisk) {
                     ctx.fillStyle = '#F87171'; // Red for risk
                     ctx.globalAlpha = 1;
                     // Pulsing effect for risk
                     const pulse = 2 + Math.sin(tick * 0.2);
                     ctx.arc(node.x, node.y, node.size + pulse, 0, Math.PI * 2);
                } else if (node.isScanned) {
                     ctx.fillStyle = '#60A5FA'; // Blue for safe/scanned
                     ctx.globalAlpha = 0.5;
                } else {
                     ctx.fillStyle = 'white';
                     ctx.globalAlpha = node.alpha;
                }
                ctx.fill();
            });

            // Update Agents
            particles.forEach(agent => {
                // Find Target Logic
                if (agent.state === 'moving' && !agent.targetNode) {
                    // Find nearest unscanned node
                    let minDist = Infinity;
                    let target = null;
                    for (const node of secondaryParticles) {
                        if (node.isScanned) continue;
                        const dx = node.x - agent.x;
                        const dy = node.y - agent.y;
                        const dist = Math.sqrt(dx*dx + dy*dy);
                        if (dist < minDist) {
                            minDist = dist;
                            target = node;
                        }
                    }
                    if (target) {
                        agent.targetNode = target;
                        agent.tx = target.x;
                        agent.ty = target.y;
                    } else {
                        // All scanned, roam randomly
                        agent.tx = Math.random() * w;
                        agent.ty = Math.random() * h;
                    }
                }

                // Move
                if (agent.state === 'moving') {
                    const dx = agent.tx - agent.x;
                    const dy = agent.ty - agent.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < 5) {
                        agent.state = 'scanning';
                        agent.scanTimer = 40; // frames
                        if (agent.targetNode) {
                            agent.targetNode.isScanned = true;
                        }
                    } else {
                        agent.vx = (dx / dist) * agent.speed;
                        agent.vy = (dy / dist) * agent.speed;
                        agent.x += agent.vx;
                        agent.y += agent.vy;
                    }
                } else if (agent.state === 'scanning') {
                    agent.scanTimer--;
                    
                    // Draw Scan Effect
                    const progress = 1 - (agent.scanTimer / 40);
                    ctx.beginPath();
                    ctx.arc(agent.x, agent.y, progress * 40, 0, Math.PI * 2);
                    ctx.strokeStyle = '#3B82F6';
                    ctx.globalAlpha = 1 - progress;
                    ctx.stroke();

                    // If risk found, draw alert line
                    if (agent.targetNode && agent.targetNode.isRisk) {
                         ctx.beginPath();
                         ctx.moveTo(agent.x, agent.y);
                         ctx.lineTo(cx, cy); // Report to central brain (implied)
                         ctx.strokeStyle = '#EF4444';
                         ctx.globalAlpha = 0.5;
                         ctx.lineWidth = 1;
                         ctx.stroke();
                         
                         // Label
                         ctx.fillStyle = '#EF4444';
                         ctx.globalAlpha = 1;
                         ctx.font = '10px monospace';
                         ctx.fillText('RISK_DETECTED', agent.x + 10, agent.y);
                    }

                    if (agent.scanTimer <= 0) {
                        agent.state = 'moving';
                        agent.targetNode = null;
                    }
                }

                // Draw Agent
                ctx.globalAlpha = 1;
                ctx.translate(agent.x, agent.y);
                const angle = Math.atan2(agent.vy, agent.vx);
                ctx.rotate(angle);
                
                ctx.fillStyle = '#3B82F6';
                ctx.beginPath();
                ctx.moveTo(5, 0);
                ctx.lineTo(-4, 3);
                ctx.lineTo(-4, -3);
                ctx.fill();
                
                ctx.rotate(-angle);
                ctx.translate(-agent.x, -agent.y);
            });
            ctx.globalAlpha = 1;
        } 
        else if (phase === 6) { // Radar
            // Sweep
            const angle = (tick * 0.03) % (Math.PI * 2);
            
            // Grid
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let i=0; i<w; i+=50) { ctx.moveTo(i, 0); ctx.lineTo(i, h); }
            for(let j=0; j<h; j+=50) { ctx.moveTo(0, j); ctx.lineTo(w, j); }
            ctx.stroke();

            // Circles
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
            [100, 250, 400].forEach(r => {
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI*2);
                ctx.stroke();
            });
            
            // Sweep Line
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(450, 0); // Radius of sweep
            ctx.strokeStyle = '#EF4444';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.restore();

            // Random blips
            if (Math.random() > 0.92) {
                const r = Math.random() * 400;
                const a = Math.random() * Math.PI * 2;
                ctx.fillStyle = '#EF4444';
                const rx = cx + Math.cos(a)*r;
                const ry = cy + Math.sin(a)*r;
                ctx.fillRect(rx, ry, 4, 4);
                
                // Text label
                ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
                ctx.font = '10px monospace';
                ctx.fillText(`ERR_${Math.floor(Math.random()*999)}`, rx + 6, ry);
            }
        }
        else if (phase === 7) { // Crypto Matrix
            ctx.fillStyle = '#EAB308'; // Yellow
            ctx.font = '14px monospace';
            
            particles.forEach((p) => {
                p.y += p.speed;
                if(p.y > h) p.y = -p.len * 20;
                
                for(let j=0; j<p.len; j++) {
                    const char = p.chars[Math.floor(Math.random() * p.chars.length)];
                    const yPos = p.y - (j * 16);
                    if (yPos > 0 && yPos < h) {
                        const alpha = Math.max(0, 1 - (j / p.len));
                        ctx.globalAlpha = alpha * (j===0 ? 1 : 0.4); // Head is bright
                        
                        if (j===0) ctx.fillStyle = '#FEF08A'; // lighter head
                        else ctx.fillStyle = '#EAB308';
                        
                        ctx.fillText(char, p.x, yPos);
                    }
                }
            });
            ctx.globalAlpha = 1;
        }
        else if (phase === 8) { // 3D Sphere (Identity)
             ctx.fillStyle = '#C084FC'; // Purple
             const rotX = tick * 0.003;
             const rotY = tick * 0.007;
             
             particles.forEach(p => {
                 // Rotate sphere math
                 let x = p.r * Math.sin(p.phi) * Math.cos(p.theta);
                 let y = p.r * Math.sin(p.phi) * Math.sin(p.theta);
                 let z = p.r * Math.cos(p.phi);
                 
                 // Rotate Y
                 let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
                 let z1 = x * Math.sin(rotY) + z * Math.cos(rotY);
                 
                 // Rotate X
                 let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
                 let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
                 
                 // Perspective projection
                 const scale = (z2 + 600) / 600; 
                 const alpha = (z2 + 250) / 500;
                 
                 if (alpha > 0) {
                     ctx.globalAlpha = Math.min(1, alpha);
                     ctx.beginPath();
                     ctx.arc(cx + x1, cy + y2, 2 * scale, 0, Math.PI*2);
                     ctx.fill();
                 }
             });
             ctx.globalAlpha = 1;
        }
        else if (phase === 9) { // Shield (Security)
            const shieldR = 180;
            
            // Shield Pulse Ring
            ctx.strokeStyle = '#4ADE80';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, shieldR, 0, Math.PI * 2);
            ctx.stroke();
            
            // Echo
            ctx.beginPath();
            ctx.arc(cx, cy, shieldR + (Math.sin(tick * 0.1) * 10), 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.2)';
            ctx.stroke();

            // Particles
            ctx.fillStyle = '#fff';
            particles.forEach(p => {
                // Initialize spawn
                if (p.state === 'spawn') {
                    const angle = Math.random() * Math.PI * 2;
                    const r = Math.max(w, h); // Outside screen
                    p.x = cx + Math.cos(angle) * r;
                    p.y = cy + Math.sin(angle) * r;
                    
                    // Aim at center
                    const aimAngle = Math.atan2(cy - p.y, cx - p.x);
                    const speed = 4 + Math.random() * 4;
                    p.vx = Math.cos(aimAngle) * speed;
                    p.vy = Math.sin(aimAngle) * speed;
                    p.state = 'flying';
                }
                
                p.x += p.vx;
                p.y += p.vy;
                
                // Collision check
                const dx = p.x - cx;
                const dy = p.y - cy;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < shieldR && p.state === 'flying') {
                     // Deflect
                     const normalAngle = Math.atan2(dy, dx);
                     // Bounce logic: just reverse roughly outwards + random
                     p.vx = Math.cos(normalAngle) * 5 + (Math.random()-0.5)*2;
                     p.vy = Math.sin(normalAngle) * 5 + (Math.random()-0.5)*2;
                     p.state = 'bouncing';
                }
                
                // Respawn if far away and bouncing
                if (dist > Math.max(w,h) && p.state === 'bouncing') {
                    p.state = 'spawn';
                }
                
                ctx.globalAlpha = p.state === 'flying' ? 0.8 : 0.4;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
        }
        else if (phase === 10) { // Governance (Sorting)
             // Simple falling blocks
             const lineY = cy;
             
             // Scan line
             ctx.beginPath();
             ctx.moveTo(0, lineY);
             ctx.lineTo(w, lineY);
             ctx.strokeStyle = 'rgba(255,255,255,0.3)';
             ctx.setLineDash([4, 4]);
             ctx.stroke();
             ctx.setLineDash([]);

             particles.forEach(p => {
                 p.y += p.speed;
                 if (p.y > h + 50) {
                     p.y = -50;
                     p.x = Math.random() * w;
                     p.type = Math.random() > 0.5 ? 'A' : 'B';
                 }
                 
                 // Color logic based on crossing the line
                 if (p.y > lineY) {
                     // Processed/Valid
                     ctx.fillStyle = p.type === 'A' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(200, 200, 200, 0.9)';
                     ctx.shadowBlur = 10;
                     ctx.shadowColor = 'white';
                 } else {
                     // Unprocessed
                     ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                     ctx.shadowBlur = 0;
                 }
                 
                 ctx.fillRect(p.x, p.y, p.w, p.h);
             });
             ctx.shadowBlur = 0;
        }

        animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', setSize);
    };
  }, [phase]);

  return (
    <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 ease-in-out"
        style={{ opacity: (phase >= 5 && phase <= 10) ? 1 : 0 }}
    />
  );
};