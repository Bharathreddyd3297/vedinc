import { motion, useScroll, useTransform } from "framer-motion";
import { FunkyHeading } from "@/components/ui/FunkyHeading";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  /* ================= WHATSAPP SUBMIT ================= */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill all fields");
      return;
    }

    const adminNumber = "919705255161";

    const message = `
New Contact Inquiry - Vedinc

Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}
    `;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${adminNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "bharat@vedinc.in",
      href: "mailto:bharat@vedinc.in",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 9705255161",
      href: "tel:+919705255161",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Hyderabad, India",
      href: "#",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="min-h-screen relative bg-black overflow-hidden py-20"
    >
      {/* Background Blur Effects */}
      <div className="absolute inset-0">
        <motion.div style={{ y }} className="absolute w-full h-full">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-green-500/5 rounded-full blur-3xl" />
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <FunkyHeading className="text-4xl md:text-5xl text-white">
              Get in <span className="text-green-400">Touch</span>
            </FunkyHeading>

            <p className="text-gray-400 max-w-xl mx-auto mt-4 text-sm">
              Have a question about our Azure DevOps courses or corporate
              training? We typically respond within 24 hours.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10">

            {/* CONTACT INFO */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 8 }}
                  className="flex items-center gap-5 bg-white/5 border border-white/10 p-5 rounded-lg group"
                >
                  <div className="w-12 h-12 rounded bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition">
                    <item.icon className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-white text-lg">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>

            {/* CONTACT FORM */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 p-7 rounded-xl backdrop-blur"
            >
              <form onSubmit={handleSubmit} className="space-y-5">

                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded text-white placeholder:text-gray-500 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded text-white placeholder:text-gray-500 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                />

                <textarea
                  placeholder="How can we help you?"
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded text-white placeholder:text-gray-500 resize-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                />

                {/* WHATSAPP BUTTON */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full py-3 rounded font-medium flex items-center justify-center gap-3 bg-green-500 text-black overflow-hidden group"
                >
                  {/* Glow Pulse */}
                  <motion.div
                    className="absolute inset-0 bg-green-400 opacity-20 blur-xl"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />

                  {/* Icon with floating animation */}
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <FaWhatsapp size={18} />
                  </motion.div>

                  <span className="relative z-10 tracking-wide">
                    Send via WhatsApp
                  </span>
                </motion.button>

              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;