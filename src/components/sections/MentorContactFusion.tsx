import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Phone, User, Send } from 'lucide-react';
import mentorPic from '@/assets/barat_pic_final.png';
import { FunkyHeading } from "@/components/ui/FunkyHeading";

const MentorContactFusion = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        phone: '',
        purpose: ''
    });

    const yValues = useTransform(scrollYProgress, [0, 1], [100, -100]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formState.name || !formState.email || !formState.phone || !formState.purpose) {
            alert("Please fill all fields");
            return;
        }

        const adminNumber = "919346401088"; // no + sign

        const message = `
New Mentor Contact Request - Vedinc Website

Name: ${formState.name}
Email: ${formState.email}
Phone: ${formState.phone}

Message:
${formState.purpose}
    `;

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${adminNumber}?text=${encodedMessage}`;

        // More reliable than window.open
        window.location.href = whatsappURL;
    };

    return (
        <section ref={sectionRef} id="mentor-contact" className="relative min-h-screen bg-transparent text-white overflow-x-hidden pt-20 px-4 md:px-12 flex items-center justify-center font-sans">

            {/* Geometric Shapes - Triangles - Clustered between Picture and Heading */}
            <motion.div
                style={{ y: yValues }}
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] left-[10%] md:left-[22%] w-0 h-0 border-l-[30px] border-l-transparent border-b-[50px] border-b-blue-600 border-r-[30px] border-r-transparent opacity-60 z-10"
            />
            <motion.div
                style={{ y: useTransform(scrollYProgress, [0, 1], [-80, 80]) }}
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-[45%] left-[8%] md:left-[18%] w-0 h-0 border-l-[25px] border-l-transparent border-b-[40px] border-b-sky-400 border-r-[25px] border-r-transparent opacity-50 z-10"
            />
            <motion.div
                style={{ y: useTransform(scrollYProgress, [0, 1], [120, -120]) }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[25%] left-[12%] md:left-[25%] w-0 h-0 border-l-[15px] border-l-transparent border-b-[25px] border-b-indigo-500 border-r-[15px] border-r-transparent opacity-70 z-10"
            />


            {/* Mentor Image - Absolute Background */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute bottom-0 left-0 md:left-0 z-10 w-full md:w-auto flex items-end justify-center pointer-events-none"
            >
                <motion.img
                    src={mentorPic}
                    alt="Mentor"
                    className="h-[60vh] md:h-[80vh] w-auto object-contain filter grayscale brightness-110 contrast-125 opacity-30 md:opacity-100"
                    style={{ transformOrigin: 'bottom center' }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            <div className="container mx-auto relative z-20 w-full max-w-4xl h-full flex flex-col items-center">

                {/* Content Area (Form) */}
                <div className="flex flex-col justify-center items-start text-left pt-10 pb-20 lg:py-20 relative z-30 w-full max-w-2xl px-4">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-black text-white uppercase tracking-widest mb-10"
                    >
                        CONTACT
                    </motion.h2>
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        onSubmit={handleSubmit}
                        className="w-full space-y-5"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormInput
                                icon={<User size={18} />}
                                placeholder="Full Name"
                                value={formState.name}
                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            />
                            <FormInput
                                icon={<Mail size={18} />}
                                placeholder="Email Address"
                                type="email"
                                value={formState.email}
                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            />
                        </div>

                        <FormInput
                            icon={<Phone size={18} />}
                            placeholder="Phone Number"
                            type="tel"
                            value={formState.phone}
                            onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        />

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="relative group"
                        >
                            <textarea
                                placeholder="How can we help you?"
                                rows={4}
                                value={formState.purpose}
                                onChange={(e) => setFormState({ ...formState, purpose: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all resize-none"
                            />
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-5 bg-primary text-white font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] hover:shadow-primary/40 transition-all border border-white/10"
                        >
                            <Send size={18} />
                            Send Message
                        </motion.button>
                    </motion.form>

                </div>

            </div>
        </section>
    );
};

const FormInput = ({ icon, ...props }: any) => (
    <div className="relative group w-full">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
            {icon}
        </div>
        <input
            {...props}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
        />
    </div>
);

export default MentorContactFusion;
