import React from 'react';
import { AssetBrain, AssetGraph, AssetCrypto, AssetFace, AssetEmail, AssetDoc } from './CapabilityAssets';

interface FeatureSpotlightProps {
    phase: number;
}

// The order in which these appear in the scroll journey (App.tsx)
// 8: Bio (Signup 1)
// 9: Phish (Signup 2)
// 5: AI (Trading 1)
// 6: Anomaly (Trading 2)
// 7: Crypto (Withdrawal 1)
// 10: Doc (Governance)
const PHASE_SEQUENCE = [8, 9, 5, 6, 7, 10];

const FeatureSpotlight: React.FC<FeatureSpotlightProps> = ({ phase }) => {
    
    // Find where we are in the sequence
    const currentIndex = PHASE_SEQUENCE.indexOf(phase);
    
    // Determine global state relative to the sequence
    // If phase is not in sequence (e.g. 0-4), we are "before" if phase < 5, "after" if phase > 10
    // But since the sequence numbers are mixed (8,9 vs 5,6), we rely on the specific phases known to be before/after.
    // Phases 0-4 are "Intro/Thesis" -> Before sequence.
    // Phase 11 is "Real World" -> After sequence.
    const isBeforeSequence = phase < 5 && phase !== -1; // -1 check just in case
    const isAfterSequence = phase === 11;

    // Mapping phases to assets and colors
    const features = [
        { id: 8, component: AssetFace, color: 'text-purple-400' },     // Signup: Identity
        { id: 9, component: AssetEmail, color: 'text-green-400' },     // Signup: Security
        { id: 5, component: AssetBrain, color: 'text-accent' },        // Trading: Intelligence
        { id: 6, component: AssetGraph, color: 'text-danger' },        // Trading: Anomalies
        { id: 7, component: AssetCrypto, color: 'text-yellow-400' },   // Withdrawal: Crypto
        { id: 10, component: AssetDoc, color: 'text-white' },          // Governance
    ];

    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none perspective-[1000px]">
            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
                {features.map((feature, i) => {
                    const AssetComponent = feature.component;
                    const isActive = phase === feature.id;
                    
                    // Determine position state
                    let state = 'hidden'; // default
                    
                    if (isActive) {
                        state = 'active';
                    } else if (isBeforeSequence) {
                        state = 'future';
                    } else if (isAfterSequence) {
                        state = 'past';
                    } else {
                        // We are inside the sequence, but this specific feature is not active.
                        // Is it past or future relative to current active one?
                        if (currentIndex !== -1) {
                            // The sequence array index tells us the truth about scroll order
                            // Find this feature's index in the sequence
                            const featureIndex = PHASE_SEQUENCE.indexOf(feature.id);
                            if (featureIndex < currentIndex) state = 'past';
                            else state = 'future';
                        } else {
                            // Should not happen if logic is correct, fallback
                            state = 'hidden';
                        }
                    }

                    // Define transforms based on state
                    let transformClass = '';
                    switch (state) {
                        case 'active':
                            transformClass = 'translate-y-0 opacity-100 scale-100 blur-0 rotate-0';
                            break;
                        case 'past':
                            transformClass = '-translate-y-[60vh] opacity-0 scale-90 blur-md rotate-[-10deg]';
                            break;
                        case 'future':
                            transformClass = 'translate-y-[60vh] opacity-0 scale-110 blur-md rotate-[10deg]';
                            break;
                        default:
                            transformClass = 'opacity-0 scale-90';
                    }

                    return (
                        <div 
                            key={feature.id}
                            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform
                            ${transformClass}`}
                        >
                            <div className={`w-full h-full p-8 md:p-16 ${feature.color}`}>
                                {/* Background glow for active element */}
                                <div className={`absolute inset-0 bg-current opacity-[0.03] blur-[60px] rounded-full transition-opacity duration-1000 ${isActive ? 'opacity-[0.15]' : 'opacity-0'}`} />
                                
                                {/* Ring decoration */}
                                <div className={`absolute inset-0 border border-current opacity-10 rounded-full scale-90 transition-transform duration-[20s] linear infinite ${isActive ? 'rotate-[360deg]' : 'rotate-0'}`} />
                                <div className={`absolute inset-0 border border-current opacity-5 rounded-full scale-110 transition-transform duration-[30s] linear infinite reverse ${isActive ? 'rotate-[-360deg]' : 'rotate-0'}`} />

                                <AssetComponent active={isActive} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FeatureSpotlight;