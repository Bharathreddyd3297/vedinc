import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative mt-24 border-t border-white/10 bg-gradient-to-b from-[#0b1624] to-[#060d18] font-sans">
            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    
                    {/* Brand Section */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="text-2xl font-black text-white tracking-tighter">
                            VedInc
                        </h3>
                        <p className="text-sm text-white/50 tracking-[0.2em] uppercase">
                            IT, Super Simplified
                        </p>
                        <div className="flex gap-5 pt-4">
                            <SocialIcon Icon={Facebook} link="https://facebook.com" />
                            <SocialIcon Icon={Twitter} link="https://twitter.com" />
                            <SocialIcon Icon={Instagram} link="https://www.instagram.com/bharathreddy_sa/" />
                            <SocialIcon Icon={Linkedin} link="https://in.linkedin.com/in/bharath-reddy329" />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col space-y-6">
                        <h4 className="text-white font-bold uppercase tracking-widest text-sm opacity-50">Contact Us</h4>
                        <div className="space-y-4">
                            <FooterContactItem icon={<Phone size={18} className="text-primary" />} text="+91 9346401088" />
                            <FooterContactItem icon={<Mail size={18} className="text-primary" />} text="bharath@vedinc.in" />
                            <FooterContactItem icon={<MapPin size={18} className="text-primary" />} text="Hyderabad, India" />
                        </div>
                    </div>

                    {/* Quick Links / Info */}
                    <div className="flex flex-col space-y-6">
                        <h4 className="text-white font-bold uppercase tracking-widest text-sm opacity-50">About</h4>
                        <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                            Empowering developers with industry-standard DevOps and Cloud training. Join our community to accelerate your tech career.
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5 w-full mb-8" />

                {/* Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                    <span>© {new Date().getFullYear()} VedInc. All rights reserved.</span>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ Icon, link }: { Icon: any, link: string }) => (
    <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all duration-300"
    >
        <Icon size={18} />
    </a>
);

const FooterContactItem = ({ icon, text }: { icon: any, text: string }) => (
    <div className="flex items-center gap-3 group cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            {icon}
        </div>
        <span className="text-sm text-white/70 group-hover:text-white transition-colors">{text}</span>
    </div>
);

export default Footer;
