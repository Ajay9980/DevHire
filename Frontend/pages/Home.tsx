import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { motion } from "motion/react";  
import { ScrollTrigger } from "gsap/ScrollTrigger";  

gsap.registerPlugin(ScrollTrigger);  
 
const Home = () => {
  const sectionRef = useRef(null); // Used for GSAP context
  const navigate = useNavigate();
 
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from('.hero-title', {
      y: -30,
      opacity: 0,
      duration: 0.8,  
      delay: 0.5,
      scale: 0.95,
      ease: 'power3.out',
    });
    tl.from('.hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
    }, "-=0.5"); // Overlap with title animation
    tl.from('.hero-buttons', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, "-=0.4"); // Overlap with subtitle animation

    // GSAP for "How It Works" section list items
    gsap.from('.how-it-works-item', {
      opacity: 0,
      x: -20,
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.how-it-works-section',
        start: 'top 80%', // Start animation when section is 80% in view
        end: 'bottom 20%',
        toggleActions: 'play none none none', // Play once on enter
      },
    });

    // GSAP for "Ready to Get Started" section (Call to Action)
    gsap.from('.cta-section-content', {
      opacity: 0,
      y: 50,
      scale: 0.9,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

  }, []); 
 
  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,  
        delayChildren: 0.5,  
      },
    },
  };

  const cardItemVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
       
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Framer Motion variants for testimonials
  const testimonialContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const testimonialItemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        
        stiffness: 80,
        damping: 10,
      },
    },
  };

  return (
    <div ref={sectionRef} className="relative bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white font-inter overflow-hidden">
      {/* Background Orbs/Glows for visual interest - consistent across pages */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/*  HERO SECTION */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20 relative z-10">
        <div className="backdrop-blur-xl bg-white/5 p-10 md:p-16 rounded-3xl shadow-2xl max-w-4xl w-full border border-white/10">
          <h1 className="hero-title text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 drop-shadow-xl">
            Welcome to <span className="bg-gradient-to-r from-green-400 to-teal-400 text-transparent bg-clip-text">DevHire</span>
          </h1>
          <p className="hero-subtitle text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-300">
            The premier platform where visionary clients connect with top-tier developers, and talented developers unlock real-world projects to elevate their careers.
          </p>
          <div className="hero-buttons flex flex-col md:flex-row gap-6 justify-center">
            <motion.button
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="ri-rocket-fill"></i> Get Started
            </motion.button>
            <motion.button
              onClick={() => navigate("/task")}
              className="border border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="ri-search-line"></i> Explore Tasks
            </motion.button>
          </div>
        </div>
      </section>

      {/* 💡 FEATURES SECTION */}
      <section className="max-w-7xl mx-auto py-24 px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-16 text-center drop-shadow-lg">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Key</span> Features
        </h2>
        <motion.div
          className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible" // Animate when in view
          viewport={{ once: true, amount: 0.3 }} // Trigger once when 30% of element is visible
        >
          {/* Feature Card 1: For Developers */}
          <motion.div
            className="bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-purple-500/30 hover:-translate-y-2 relative overflow-hidden group"
            variants={cardItemVariants}
            whileHover={{ scale: 1.03 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-3 text-purple-300 relative z-10 flex items-center gap-3">
              <i className="ri-code-s-slash-fill text-3xl"></i> For Developers
            </h3>
            <p className="text-gray-300 relative z-10 text-lg leading-relaxed">
              Dive into exciting projects, showcase your expertise, build a robust portfolio, and get fairly compensated for your exceptional skills.
            </p>
          </motion.div>

          {/* Feature Card 2: For Clients */}
          <motion.div
            className="bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-green-500/30 hover:-translate-y-2 relative overflow-hidden group"
            variants={cardItemVariants}
            whileHover={{ scale: 1.03 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-3 text-green-300 relative z-10 flex items-center gap-3">
              <i className="ri-briefcase-4-fill text-3xl"></i> For Clients
            </h3>
            <p className="text-gray-300 relative z-10 text-lg leading-relaxed">
              Effortlessly post your unique tasks, browse through competitive bids, and hire the perfect developer to bring your vision to life, all in one place.
            </p>
          </motion.div>

          {/* Feature Card 3: Secure Platform */}
          <motion.div
            className="bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-blue-500/30 hover:-translate-y-2 relative overflow-hidden group"
            variants={cardItemVariants}
            whileHover={{ scale: 1.03 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-3 text-blue-300 relative z-10 flex items-center gap-3">
              <i className="ri-lock-fill text-3xl"></i> Secure Platform
            </h3>
            <p className="text-gray-300 relative z-10 text-lg leading-relaxed">
              Rest assured with our robust security measures, including secure authentication, transparent bidding, and streamlined task management.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ⚙️ HOW IT WORKS SECTION */}
      <section className="how-it-works-section bg-white/5 py-24 px-6 relative z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-16 drop-shadow-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">How</span> DevHire Works
          </h2>
          <ol className="space-y-8 text-left text-xl text-gray-200 leading-relaxed">
            <li className="how-it-works-item flex items-start gap-4">
              <span className="flex-shrink-0 text-3xl font-extrabold text-orange-400">1️⃣</span>
              <div>
                <strong>Sign Up:</strong> Join as a <span className="font-semibold text-blue-300">Client</span> to post projects or as a <span className="font-semibold text-green-300">Developer</span> to find opportunities.
              </div>
            </li>
            <li className="how-it-works-item flex items-start gap-4">
              <span className="flex-shrink-0 text-3xl font-extrabold text-red-400">2️⃣</span>
              <div>
                <strong>Clients Post Tasks:</strong> Clearly define your project needs, set a budget, and provide detailed descriptions.
              </div>
            </li>
            <li className="how-it-works-item flex items-start gap-4">
              <span className="flex-shrink-0 text-3xl font-extrabold text-yellow-400">3️⃣</span>
              <div>
                <strong>Developers Bid:</strong> Browse available tasks, submit competitive bids, and highlight your relevant skills and experience.
              </div>
            </li>
            <li className="how-it-works-item flex items-start gap-4">
              <span className="flex-shrink-0 text-3xl font-extrabold text-purple-400">4️⃣</span>
              <div>
                <strong>Clients Select:</strong> Review developer profiles, compare bids, and choose the perfect match for your project.
              </div>
            </li>
            <li className="how-it-works-item flex items-start gap-4">
              <span className="flex-shrink-0 text-3xl font-extrabold text-teal-400">5️⃣</span>
              <div>
                <strong>Project Completion & Payment:</strong> Collaborate efficiently, deliver high-quality work, and receive secure payment upon successful completion. 💰
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 🌟 WHAT OUR USERS SAY (Testimonials) SECTION */}
      <section className="bg-gradient-to-br from-indigo-900 to-gray-900 py-24 px-6 relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-16 drop-shadow-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">What</span> Our Users Say
          </h2>
          <motion.div
            className="grid sm:grid-cols-1 md:grid-cols-2 gap-10"
            variants={testimonialContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Testimonial Card 1 */}
            <motion.div
              className="bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center transition-all duration-300 hover:shadow-yellow-500/30 hover:-translate-y-2"
              variants={testimonialItemVariants}
            >
              <i className="ri-double-quotes-l text-5xl text-yellow-400 mb-4"></i>
              <p className="text-gray-200 text-lg mb-6 italic leading-relaxed">
                "DevHire transformed how I find freelance work. The projects are high-quality, and the platform is incredibly user-friendly. I've found amazing clients here!"
              </p>
              <div className="font-semibold text-xl text-yellow-300">
                Jane Doe <span className="text-gray-400">- Senior Developer</span>
              </div>
            </motion.div>

            {/* Testimonial Card 2 */}
            <motion.div
              className="bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center transition-all duration-300 hover:shadow-orange-500/30 hover:-translate-y-2"
              variants={testimonialItemVariants}
            >
              <i className="ri-double-quotes-l text-5xl text-orange-400 mb-4"></i>
              <p className="text-gray-200 text-lg mb-6 italic leading-relaxed">
                "Finding the right developer used to be a nightmare. DevHire made it simple, secure, and efficient. Posted a task, received great bids, and got my project done perfectly!"
              </p>
              <div className="font-semibold text-xl text-orange-300">
                John Smith <span className="text-gray-400">- Startup Founder</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 🚀 READY TO GET STARTED? (Call to Action) SECTION */}
      <section className="cta-section bg-white/5 py-24 px-6 relative z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center cta-section-content">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 drop-shadow-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Ready</span> to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Join DevHire today and unlock a world of opportunities. Whether you're a client with a vision or a developer ready to build, your next big project awaits!
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <motion.button
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-teal-700 transition-all shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="ri-user-add-fill"></i> Sign Up Now
            </motion.button>
            <motion.button
              onClick={() => navigate("/posttask")}
              className="border border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="ri-file-add-fill"></i> Post Your Task
            </motion.button>
          </div>
        </div>
      </section>

      {/* 🧠 FOOTER */}
      <footer className="bg-gray-900 text-white py-8 relative z-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm text-gray-400">&copy; 2025 DevHire. All rights reserved.</p>
          <div className="space-x-6 mt-6 md:mt-0 text-base">
            <motion.button
              onClick={() => navigate("/about")}
              className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              About Us
            </motion.button>
            <motion.button
              onClick={() => navigate("/contact")}
              className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact
            </motion.button>
            <motion.button
              onClick={() => navigate("/dashboard")}
              className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Dashboard
            </motion.button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
