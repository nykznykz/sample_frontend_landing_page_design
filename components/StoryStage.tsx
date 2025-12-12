import React, { useRef, useEffect } from 'react';

interface StoryStageProps {
  id: string;
  children: React.ReactNode;
  onProgress?: (progress: number) => void;
  onEnter?: () => void;
  className?: string;
}

const StoryStage: React.FC<StoryStageProps> = ({ id, children, onProgress, onEnter, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const height = rect.height;
      
      // Check for enter
      if (rect.top < windowHeight * 0.6 && rect.bottom > windowHeight * 0.6) {
          onEnter?.();
      }

      // Calculate progress (0 to 1) while in viewport
      // 0 when top of section is at bottom of viewport
      // 1 when bottom of section is at top of viewport
      let progress = (windowHeight - rect.top) / (windowHeight + height);
      progress = Math.max(0, Math.min(1, progress));
      
      onProgress?.(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onProgress, onEnter]);

  return (
    <section 
        id={id} 
        ref={ref} 
        className={`min-h-screen flex flex-col justify-center items-center relative z-10 pointer-events-none ${className}`}
    >
      <div className="container mx-auto px-6 pointer-events-auto">
        {children}
      </div>
    </section>
  );
};

export default StoryStage;