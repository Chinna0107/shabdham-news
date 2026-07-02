import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { FaBullseye, FaRocket, FaEye, FaArrowRight } from 'react-icons/fa6';

const StaticPage = ({ title, children, containerClass = "bg-white p-8 rounded shadow-sm text-gray-700", bgClass = "bg-gray-50" }) => {
  return (
    <>
      <Helmet>
        <title>{title} - SHABDHAM</title>
      </Helmet>
      <div className={`min-h-screen relative overflow-hidden ${bgClass} py-20`}>
        {/* Ambient Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-brand-red/5 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-orange-500/5 blur-[100px]"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-red-600/5 blur-[100px]"></div>
          
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLCAwLCAwLCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] z-0 opacity-50"></div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-brand-red font-semibold text-sm mb-4 tracking-wider uppercase">
              Discover Our Story
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 mb-6 tracking-tight">
              {title}
            </h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-brand-red to-orange-500 mx-auto rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
          </div>
          <div className={containerClass}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export const About = () => (
  <StaticPage title="About Us" containerClass="w-full" bgClass="bg-white">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
      
      {/* Purpose Card */}
      <div className="group relative bg-white/70 backdrop-blur-xl rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(220,38,38,0.1)] transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 flex flex-col h-full overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-red-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500 group-hover:rotate-3">
            <FaBullseye className="text-3xl text-brand-red group-hover:text-red-600 transition-colors" />
          </div>
          
          <div className="flex items-center space-x-3 mb-5">
            <span className="text-brand-red font-bold text-lg">01</span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Purpose</h2>
          </div>
          
          <p className="text-gray-600 leading-loose text-lg flex-grow font-medium group-hover:text-gray-800 transition-colors duration-300">
            To build a modern digital ecosystem that bridges traditional investigative print journalism with
            digital media, providing an uncorrupted platform for grassroots realities, political analysis,
            and government accountability.
          </p>
          
          <div className="mt-8 flex items-center text-brand-red font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
            <span>Learn More</span>
            <FaArrowRight className="ml-2" />
          </div>
        </div>
      </div>
      
      {/* Mission Card (Center Highlight) */}
      <div className="group relative bg-gradient-to-br from-brand-red via-red-600 to-red-800 rounded-[2rem] p-10 shadow-[0_10px_40px_rgba(220,38,38,0.3)] hover:shadow-[0_20px_50px_rgba(220,38,38,0.5)] transition-all duration-500 transform hover:-translate-y-4 lg:-translate-y-6 text-white flex flex-col h-full overflow-hidden z-20 border border-red-400/30">
        {/* Animated Glow Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/30 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-3xl -ml-20 -mb-20 transition-all duration-700"></div>
        
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:-rotate-3">
            <FaRocket className="text-3xl text-white drop-shadow-md" />
          </div>
          
          <div className="flex items-center space-x-3 mb-5">
            <span className="text-red-200 font-bold text-lg">02</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">Mission</h2>
          </div>
          
          <div className="bg-black/10 p-5 rounded-2xl mb-6 backdrop-blur-md border border-white/10 shadow-inner group-hover:bg-black/15 transition-colors duration-500">
            <p className="font-bold text-xl font-telugu italic tracking-wide leading-relaxed text-red-50 drop-shadow-md">
              "మేధావుల మౌనం.. దేశ నాశనా కోరుతుంది.."
            </p>
          </div>
          
          <p className="text-red-50 leading-loose text-lg flex-grow font-medium">
            To shatter the silence of intellectuals and the bias
            of affiliated media by delivering ground-level truths. The platform empowers citizens by
            highlighting rural struggles, analyzing political moves without prejudice, and holding public
            institutions accountable through high-quality multimedia and digital print journalism.
          </p>
        </div>
      </div>

      {/* Vision Card */}
      <div className="group relative bg-white/70 backdrop-blur-xl rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(220,38,38,0.1)] transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 flex flex-col h-full overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-bl from-white via-white to-red-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500 group-hover:rotate-3">
            <FaEye className="text-3xl text-brand-red group-hover:text-red-600 transition-colors" />
          </div>
          
          <div className="flex items-center space-x-3 mb-5">
            <span className="text-brand-red font-bold text-lg">03</span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Vision</h2>
          </div>
          
          <p className="text-gray-600 leading-loose text-lg flex-grow font-medium group-hover:text-gray-800 transition-colors duration-300">
            To be the most trusted, independent "People's Voice" in the state—a daily digital habit for
            citizens seeking the truth, setting a new standard for fearless journalism in the digital era.
          </p>
          
          <div className="mt-8 flex items-center text-brand-red font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
            <span>Learn More</span>
            <FaArrowRight className="ml-2" />
          </div>
        </div>
      </div>
      
    </div>
  </StaticPage>
);

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Name: ${formData.name}%0AEmail: ${formData.email}%0AMessage: ${formData.message}`;
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <StaticPage title="Contact Us" containerClass="w-full" bgClass="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Have a story to share, a tip to report, or facing an issue? Fill out the form and our team will get back to you promptly.
        </p>
        
        <div className="space-y-6 text-gray-600 font-medium">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 text-brand-red rounded-full flex items-center justify-center shrink-0">
              <FaBullseye size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wide">Email</p>
              <p className="text-lg">info@shabdhamtv.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 text-brand-red rounded-full flex items-center justify-center shrink-0">
              <FaBullseye size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wide">Phone</p>
              <p className="text-lg">+91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <form className="relative z-10 flex flex-col space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Name</label>
            <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-red/20" placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Email</label>
            <input type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-red/20" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Message / Issue</label>
            <textarea required rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-red/20 resize-none" placeholder="How can we help?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
          </div>
          <button type="submit" className="w-full bg-brand-red text-white py-3.5 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30">
            Send Message on WhatsApp
          </button>
        </form>
      </div>
    </div>
  </StaticPage>
  );
};

export const Advertise = () => (
  <StaticPage title="Advertise with Us" containerClass="w-full max-w-4xl mx-auto" bgClass="bg-white">
    <div className="bg-white/80 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-white">
        <FaRocket className="text-4xl text-brand-red" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Reach Millions of Telugu Readers</h2>
      <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
        Partner with Shabdham TV to amplify your brand's voice across Telangana and Andhra Pradesh. We offer premium ad placements, including 300x250 sidebar banners, sponsored articles, and full-page e-paper ads.
      </p>
      <div className="bg-gray-50 p-6 rounded-2xl inline-block text-left mb-8 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-3 text-lg">Available Ad Slots:</h3>
        <ul className="space-y-2 text-gray-600 font-medium">
          <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-red"></span> Homepage Top Banner (728x90)</li>
          <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-red"></span> Article Sidebar (300x250)</li>
          <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-red"></span> Video Pre-roll Ads</li>
          <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-red"></span> E-Paper Full Page</li>
        </ul>
      </div>
      <div>
        <p className="font-bold text-gray-500 uppercase tracking-wider text-sm mb-2">Contact our Sales Team</p>
        <p className="text-2xl font-bold text-brand-red">ads@shabdham.com</p>
      </div>
    </div>
  </StaticPage>
);

export const Privacy = () => (
  <StaticPage title="Privacy Policy" containerClass="relative bg-white p-10 md:p-16 rounded-[2rem] shadow-sm max-w-4xl mx-auto border border-gray-100 z-10">
    <div className="prose prose-lg prose-red max-w-none text-gray-600">
      <p className="font-medium text-xl mb-6">
        Your privacy is important to us. This privacy policy explains how we collect and use your data to provide a seamless and secure experience.
      </p>
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h3>
      <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.</p>
      
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h3>
      <p>We use the information we collect to deliver and improve our services, communicate with you, and personalize your experience on Shabdham TV.</p>
      
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h3>
      <p>We implement appropriate technical and organizational measures to protect the personal information we hold from unauthorized access or disclosure.</p>
    </div>
  </StaticPage>
);

export const Terms = () => (
  <StaticPage title="Terms & Conditions" containerClass="relative bg-white p-10 md:p-16 rounded-[2rem] shadow-sm max-w-4xl mx-auto border border-gray-100 z-10">
    <div className="prose prose-lg prose-red max-w-none text-gray-600">
      <p className="font-medium text-xl mb-6">
        Welcome to Shabdham TV. By accessing our website, you agree to these terms and conditions.
      </p>
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h3>
      <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
      
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Content Copyright</h3>
      <p>All content published on Shabdham TV, including text, graphics, logos, and videos, is the property of Shabdham TV and is protected by copyright laws.</p>
      
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Conduct</h3>
      <p>Users agree not to use the website in a way that may cause damage, interrupt service, or violate any local or international laws.</p>
    </div>
  </StaticPage>
);
