import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-8 mix-blend-difference text-white">
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-xl tracking-tighter">SENTINEL</span>
        
        <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Manifesto</a>
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Technology</a>
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Pricing</a>
        </div>

        <a href="#" className="text-sm font-medium border-b border-white pb-0.5 hover:opacity-70 transition-opacity">
            Login
        </a>
      </div>
    </nav>
  );
};

export default Navbar;