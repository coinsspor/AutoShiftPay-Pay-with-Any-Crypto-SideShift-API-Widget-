import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeftRight, Sparkles, Copy, CheckCircle2, Clock, Loader2,
  TrendingUp, RefreshCw, Zap, ShieldCheck, Info, ChevronDown, XCircle,
  ExternalLink, Wallet, DollarSign, Activity, Send, Download, Upload, 
  AlertCircle, Globe, Star
} from "lucide-react";
import QRCode from "qrcode";
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4455/api";
const BRAND = import.meta.env.VITE_BRAND_NAME || "AutoShiftPay";

const config = getDefaultConfig({
  appName: 'AutoShiftPay',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
});

const queryClient = new QueryClient();

// Particles
const ParticlesBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5, speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25, opacity: Math.random() * 0.5 + 0.3
      });
    }
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x > canvas.width) p.x = 0; if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0; if (p.y < 0) p.y = canvas.height;
        ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-30" />;
};

// Intro
const IntroAnimation = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(interval); setTimeout(onComplete, 500); return 100; } return p + 2; });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);
  
  return (
    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} className="mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 p-1">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain rounded-full" />
          </div>
        </div>
      </motion.div>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-black mb-4">
        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">{BRAND}</span>
      </motion.h1>
      <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  );
};

// UI Components
const GlassCard = ({ children, className = "" }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className={`bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl ${className}`}>
    {children}
  </motion.div>
);

const ModernInput = ({ icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />}
    <input {...props}
      className={`w-full bg-slate-900/60 border-2 border-slate-700/50 rounded-2xl ${Icon ? 'pl-14' : 'pl-5'} pr-5 py-4 text-white placeholder-gray-500 
      focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none font-medium`} />
  </div>
);

const ModernSelect = ({ icon: Icon, children, ...props }) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />}
    <select {...props}
      className={`w-full bg-slate-900/60 border-2 border-slate-700/50 rounded-2xl ${Icon ? 'pl-14' : 'pl-5'} pr-12 py-4 text-white appearance-none cursor-pointer
      focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none font-medium`}>
      {children}
    </select>
    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
  </div>
);

const GradientButton = ({ children, variant = "primary", loading, icon: Icon, ...props }) => {
  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold shadow-xl",
    secondary: "bg-slate-800/80 hover:bg-slate-700/80 border-2 border-slate-700 text-white font-semibold",
    outline: "border-2 border-emerald-500 hover:bg-emerald-500/10 text-emerald-400 font-semibold"
  };
  return (
    <motion.button {...props} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={props.disabled || loading}
      className={`px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 ${variants[variant]} ${props.className || ""}`}>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : Icon && <Icon className="h-5 w-5" />}
      {children}
    </motion.button>
  );
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, 5000); return () => clearTimeout(timer); }, [onClose]);
  const config = {
    success: { icon: CheckCircle2, color: "from-emerald-500/20 border-emerald-500/50", iconColor: "text-emerald-400" },
    error: { icon: XCircle, color: "from-red-500/20 border-red-500/50", iconColor: "text-red-400" },
    info: { icon: Info, color: "from-cyan-500/20 border-cyan-500/50", iconColor: "text-cyan-400" }
  };
  const { icon: Icon, color, iconColor } = config[type] || config.info;
  return (
    <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
      className={`fixed top-6 right-6 z-50 bg-gradient-to-br ${color} backdrop-blur-xl border-2 rounded-2xl p-5 shadow-2xl flex items-center gap-4 min-w-[350px]`}>
      <div className="p-2 rounded-xl bg-slate-900/50"><Icon className={`h-6 w-6 ${iconColor}`} /></div>
      <p className="flex-1 text-sm font-semibold">{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
    </motion.div>
  );
};

// Main App
function MainApp() {
  const [showIntro, setShowIntro] = useState(true);
  const [depositCoin, setDepositCoin] = useState("btc");
  const [settleCoin, setSettleCoin] = useState("eth");
  const [settleAddress, setSettleAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [shift, setShift] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const coins = ["BTC", "ETH", "SOL", "USDT", "USDC", "XMR", "LTC"];
  const canQuote = useMemo(() => depositCoin && settleCoin && amount && Number(amount) > 0, [depositCoin, settleCoin, amount]);
  const showToast = useCallback((message, type = "info") => setToast({ message, type }), []);
  
  const handleQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/quote`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depositCoin, depositNetwork: "mainnet", settleCoin, settleNetwork: "mainnet", depositAmount: amount })
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setQuote(data);
      setShift(null);
      showToast("✅ Quote received!", "success");
    } catch (err) {
      showToast("❌ " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateShift = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/shift/fixed`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: quote.id, settleAddress })
      });
      if (!res.ok) throw new Error("Failed to create shift");
      const data = await res.json();
      setShift(data);
      if (data?.depositAddress) {
        const url = await QRCode.toDataURL(String(data.depositAddress));
        setQrDataUrl(url);
      }
      showToast("✅ Shift created! Send crypto to the address below", "success");
    } catch (err) {
      showToast("❌ " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      <ParticlesBackground />
      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>
      <AnimatePresence>{showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}</AnimatePresence>
      
      {!showIntro && (
        <>
          <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt={BRAND} className="w-10 h-10 rounded-full" />
                <span className="text-xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">{BRAND}</span>
              </div>
              <ConnectButton />
            </div>
          </nav>
          
          <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl md:text-7xl font-black mb-6">
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
                  Cross-Chain Swaps
                </span>
                <br />Made Simple
              </h1>
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                Accept any crypto on any chain • Receive in your preferred asset • Powered by SideShift.ai
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
              {[
                { icon: Sparkles, label: "Assets", value: "200+", color: "text-emerald-400" },
                { icon: Globe, label: "Networks", value: "40+", color: "text-cyan-400" },
                { icon: Zap, label: "Avg Time", value: "< 5min", color: "text-blue-400" },
                { icon: Star, label: "Users", value: "10K+", color: "text-purple-400" }
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                  <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                  <div className={`text-4xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 pb-16">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <GlassCard>
                  <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <ArrowLeftRight className="h-8 w-8 text-emerald-400" />
                    Instant Swap
                  </h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                          <Upload className="h-4 w-4" />You Send
                        </label>
                        <ModernSelect icon={DollarSign} value={depositCoin} onChange={(e) => setDepositCoin(e.target.value)}>
                          {coins.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                        </ModernSelect>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                          <Download className="h-4 w-4" />You Receive
                        </label>
                        <ModernSelect icon={Wallet} value={settleCoin} onChange={(e) => setSettleCoin(e.target.value)}>
                          {coins.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                        </ModernSelect>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-3">Amount</label>
                      <ModernInput icon={DollarSign} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.001" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-3">Receive Address</label>
                      <ModernInput icon={Wallet} value={settleAddress} onChange={(e) => setSettleAddress(e.target.value)} placeholder="Enter your wallet address" />
                    </div>
                    <div className="flex gap-4">
                      <GradientButton variant="primary" disabled={!canQuote} loading={loading} onClick={handleQuote} icon={TrendingUp} className="flex-1">
                        Get Quote
                      </GradientButton>
                      <GradientButton variant="outline" onClick={() => { setQuote(null); setShift(null); setAmount(""); }} icon={RefreshCw}>
                        Reset
                      </GradientButton>
                    </div>
                  </div>
                </GlassCard>
                
                {quote && !shift && (
                  <GlassCard className="mt-8">
                    <h3 className="text-2xl font-bold mb-6">Quote Details</h3>
                    <div className="grid grid-cols-2 gap-4 p-6 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-2 border-emerald-500/30 rounded-2xl mb-6">
                      <div>
                        <div className="text-xs text-gray-400 mb-2">Send</div>
                        <div className="text-3xl font-black text-emerald-400">{quote.depositAmount}</div>
                        <div className="text-sm text-gray-400">{depositCoin.toUpperCase()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-2">Receive</div>
                        <div className="text-3xl font-black text-cyan-400">{quote.settleAmount}</div>
                        <div className="text-sm text-gray-400">{settleCoin.toUpperCase()}</div>
                      </div>
                    </div>
                    <GradientButton variant="primary" loading={loading} onClick={handleCreateShift} icon={Send} className="w-full">
                      Create Shift & Get Deposit Address
                    </GradientButton>
                  </GlassCard>
                )}
                
                {shift && (
                  <GlassCard className="mt-8">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                      Shift Created!
                    </h3>
                    {qrDataUrl && (
                      <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6">
                        <img src={qrDataUrl} alt="QR" className="w-64 h-64 mx-auto rounded-2xl" />
                      </div>
                    )}
                    <div className="p-6 bg-slate-800/50 border-2 border-slate-700 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold flex items-center gap-2">
                          <Send className="h-4 w-4 text-emerald-400" />Deposit Address
                        </span>
                      </div>
                      <div className="font-mono text-sm break-all bg-black/50 p-4 rounded-xl">{shift.depositAddress}</div>
                      {shift.depositAmount && (
                        <div className="flex justify-between pt-4 border-t border-slate-700">
                          <span className="text-sm text-gray-400">Amount</span>
                          <span className="font-bold text-lg text-emerald-400">{shift.depositAmount} {shift.depositCoin?.toUpperCase()}</span>
                        </div>
                      )}
                      {shift.id && (
                        <a href={`https://sideshift.ai/orders/${shift.id}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all">
                          <ExternalLink className="h-5 w-5" />View on SideShift
                        </a>
                      )}
                    </div>
                  </GlassCard>
                )}
              </div>
              
              <div>
                <GlassCard>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-400" />
                    Why {BRAND}?
                  </h3>
                  <ul className="space-y-4">
                    {[
                      { icon: Sparkles, text: "200+ Cryptocurrencies", desc: "Swap between any major coins" },
                      { icon: Zap, text: "Lightning Fast", desc: "Complete swaps in under 5 minutes" },
                      { icon: ShieldCheck, text: "Secure & Safe", desc: "Non-custodial, your keys your crypto" },
                      { icon: Globe, text: "Global Access", desc: "Available worldwide, no restrictions" }
                    ].map((item, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all">
                        <item.icon className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-bold text-white mb-1">{item.text}</div>
                          <div className="text-sm text-gray-400">{item.desc}</div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </GlassCard>
                
                <GlassCard className="mt-8">
                  <h3 className="text-xl font-bold mb-6">How It Works</h3>
                  <div className="space-y-4">
                    {[
                      { step: "1", title: "Connect Wallet", desc: "Link your crypto wallet securely" },
                      { step: "2", title: "Select Coins", desc: "Choose what to send and receive" },
                      { step: "3", title: "Get Quote", desc: "View real-time exchange rates" },
                      { step: "4", title: "Complete Swap", desc: "Receive funds instantly" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-3 bg-slate-800/30 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <div className="font-bold text-white">{item.title}</div>
                          <div className="text-sm text-gray-400">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
          
          <footer className="mt-20 border-t border-slate-800 bg-slate-900/50 backdrop-blur-xl py-8 text-center">
            <p className="text-gray-500 text-sm">© 2025 {BRAND} • Built for SideShift.ai Buildathon</p>
          </footer>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <MainApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
