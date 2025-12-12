import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-surface border-t border-white/10 py-16">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                                <ShieldCheck className="text-white w-3 h-3" />
                            </div>
                            <span className="font-display font-bold text-white">SENTINEL</span>
                        </div>
                        <p className="text-white/40 text-sm">
                            Next-generation fraud prevention for the modern financial ecosystem.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="font-bold mb-4 text-white">Product</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><a href="#" className="hover:text-primary">Features</a></li>
                            <li><a href="#" className="hover:text-primary">Integrations</a></li>
                            <li><a href="#" className="hover:text-primary">Pricing</a></li>
                            <li><a href="#" className="hover:text-primary">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-white">Company</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><a href="#" className="hover:text-primary">About</a></li>
                            <li><a href="#" className="hover:text-primary">Careers</a></li>
                            <li><a href="#" className="hover:text-primary">Blog</a></li>
                            <li><a href="#" className="hover:text-primary">Contact</a></li>
                        </ul>
                    </div>
                    
                    <div>
                         <h4 className="font-bold mb-4 text-white">Legal</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary">Security</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/20 text-xs">© 2024 Sentinel AI Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;