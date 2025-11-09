import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeftRight, Sparkles, Copy, CheckCircle2, Clock, Loader2,
  TrendingUp, RefreshCw, Zap, ShieldCheck, Info, ChevronDown, XCircle,
  ExternalLink, Wallet, DollarSign, Send, Download, Upload, 
  AlertCircle, Globe, Star, Timer, Network
} from "lucide-react";
import QRCode from "qrcode";
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const API_BASE = "https://autoshiftpay.coinsspor.com/api";
const BRAND = "AutoShiftPay";

const config = getDefaultConfig({
  appName: 'AutoShiftPay',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
});

const queryClient = new QueryClient();

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
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-30" />;
};

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

const StatusBadge = ({ status }) => {
  const statusConfig = {
    waiting: { label: "Waiting", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50", icon: Clock },
    processing: { label: "Processing", color: "bg-blue-500/20 text-blue-400 border-blue-500/50", icon: Loader2 },
    settled: { label: "Completed", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50", icon: CheckCircle2 },
    refund: { label: "Refund", color: "bg-orange-500/20 text-orange-400 border-orange-500/50", icon: AlertCircle },
    expired: { label: "Expired", color: "bg-red-500/20 text-red-400 border-red-500/50", icon: XCircle }
  };
  const config = statusConfig[status] || statusConfig.waiting;
  const Icon = config.icon;
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${config.color} font-semibold text-sm`}>
      <Icon className={`h-4 w-4 ${status === 'processing' ? 'animate-spin' : ''}`} />
      {config.label}
    </div>
  );
};

function MainApp() {
  const [allCoins, setAllCoins] = useState([]);
  const [depositCoin, setDepositCoin] = useState("");
  const [depositNetwork, setDepositNetwork] = useState("");
  const [settleCoin, setSettleCoin] = useState("");
  const [settleNetwork, setSettleNetwork] = useState("");
  const [settleAddress, setSettleAddress] = useState("");
  const [refundAddress, setRefundAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [shift, setShift] = useState(null);
  const [shiftStatus, setShiftStatus] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const pollIntervalRef = useRef(null);
  
  const showToast = useCallback((message, type = "info") => setToast({ message, type }), []);
  
  // Fetch all coins on mount
  useEffect(() => {
    fetch(`${API_BASE}/coins`)
      .then(res => res.json())
      .then(data => {
        setAllCoins(data);
        const btc = data.find(c => c.coin === 'BTC');
        const eth = data.find(c => c.coin === 'ETH');
        if (btc) {
          setDepositCoin('BTC');
          setDepositNetwork(btc.mainnet || btc.networks[0]);
        }
        if (eth) {
          setSettleCoin('ETH');
          setSettleNetwork(eth.mainnet || eth.networks[0]);
        }
      })
      .catch(err => showToast("Failed to load coins", "error"));
  }, [showToast]);
  
  // Get networks for selected coins
  const depositNetworks = useMemo(() => {
    if (!depositCoin) return [];
    const coin = allCoins.find(c => c.coin === depositCoin);
    return coin?.networks || [];
  }, [depositCoin, allCoins]);
  
  const settleNetworks = useMemo(() => {
    if (!settleCoin) return [];
    const coin = allCoins.find(c => c.coin === settleCoin);
    return coin?.networks || [];
  }, [settleCoin, allCoins]);
  
  // Auto-select network when coin changes
  useEffect(() => {
    if (depositCoin && depositNetworks.length > 0) {
      const coin = allCoins.find(c => c.coin === depositCoin);
      setDepositNetwork(coin?.mainnet || depositNetworks[0]);
    }
  }, [depositCoin, allCoins]);
  
  useEffect(() => {
    if (settleCoin && settleNetworks.length > 0) {
      const coin = allCoins.find(c => c.coin === settleCoin);
      setSettleNetwork(coin?.mainnet || settleNetworks[0]);
    }
  }, [settleCoin, allCoins]);
  
  const canQuote = useMemo(() => 
    depositCoin && depositNetwork && settleCoin && settleNetwork && amount && Number(amount) > 0 && settleAddress,
    [depositCoin, depositNetwork, settleCoin, settleNetwork, amount, settleAddress]
  );
  
  // Quote expiration timer
  useEffect(() => {
    if (!quote?.expiresAt) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(quote.expiresAt).getTime();
      const diff = expires - now;
      if (diff <= 0) {
        setTimeLeft(null);
        setQuote(null);
        showToast("Quote expired. Please request a new one.", "error");
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [quote, showToast]);
  
  // Poll shift status
  const pollShiftStatus = useCallback(async (shiftId) => {
    try {
      const res = await fetch(`${API_BASE}/shifts/${shiftId}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setShiftStatus(data);
      if (['settled', 'refunded', 'expired'].includes(data.status)) {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        if (data.status === 'settled') showToast("✅ Swap completed!", "success");
      }
    } catch (err) {
      console.error("Poll error:", err);
    }
  }, [showToast]);
  
  useEffect(() => {
    if (shift?.id && !pollIntervalRef.current) {
      pollShiftStatus(shift.id);
      pollIntervalRef.current = setInterval(() => pollShiftStatus(shift.id), 10000);
    }
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [shift, pollShiftStatus]);
  
  const handleQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depositCoin: depositCoin.toLowerCase(),
          depositNetwork,
          settleCoin: settleCoin.toLowerCase(),
          settleNetwork,
          depositAmount: amount
        })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to get quote");
      }
      const data = await res.json();
      setQuote(data);
      setShift(null);
      setShiftStatus(null);
      showToast("✅ Quote received! Valid for 15 minutes", "success");
    } catch (err) {
      showToast("❌ " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateShift = async () => {
    setLoading(true);
    try {
      const body = {
        quoteId: quote.id,
        settleAddress,
        ...(refundAddress ? { refundAddress } : {})
      };
      const res = await fetch(`${API_BASE}/shift/fixed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create shift");
      }
      const data = await res.json();
      setShift(data);
      setShiftStatus(data);
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
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("📋 Copied!", "success");
  };
  
  const handleReset = () => {
    setQuote(null);
    setShift(null);
    setShiftStatus(null);
    setAmount("");
    setQrDataUrl("");
    setTimeLeft(null);
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };
  
  const uniqueCoins = useMemo(() => {
    const coins = Array.from(new Set(allCoins.map(c => c.coin)));
    return coins.sort();
  }, [allCoins]);
  
  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      <ParticlesBackground />
      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>
      
      <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt={BRAND} className="w-10 h-10 rounded-full" />
            <span className="text-xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">{BRAND}</span>
          </div>
          <ConnectButton />
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
              Cross-Chain Swaps
            </span>
            <br />Made Simple
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Swap any crypto to any crypto • {uniqueCoins.length}+ assets • 40+ networks
          </p>
        </div>
        
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
                      <option value="">Select coin...</option>
                      {uniqueCoins.map(c => <option key={c} value={c}>{c}</option>)}
                    </ModernSelect>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                      <Network className="h-4 w-4" />Network
                    </label>
                    <ModernSelect icon={Network} value={depositNetwork} onChange={(e) => setDepositNetwork(e.target.value)} disabled={!depositCoin}>
                      {depositNetworks.map(n => <option key={n} value={n}>{n.toUpperCase()}</option>)}
                    </ModernSelect>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                      <Download className="h-4 w-4" />You Receive
                    </label>
                    <ModernSelect icon={Wallet} value={settleCoin} onChange={(e) => setSettleCoin(e.target.value)}>
                      <option value="">Select coin...</option>
                      {uniqueCoins.map(c => <option key={c} value={c}>{c}</option>)}
                    </ModernSelect>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                      <Network className="h-4 w-4" />Network
                    </label>
                    <ModernSelect icon={Network} value={settleNetwork} onChange={(e) => setSettleNetwork(e.target.value)} disabled={!settleCoin}>
                      {settleNetworks.map(n => <option key={n} value={n}>{n.toUpperCase()}</option>)}
                    </ModernSelect>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3">Amount</label>
                  <ModernInput icon={DollarSign} type="number" step="any" value={amount} 
                    onChange={(e) => setAmount(e.target.value)} placeholder="0.001" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Receive Address
                  </label>
                  <ModernInput icon={Wallet} value={settleAddress} 
                    onChange={(e) => setSettleAddress(e.target.value)} placeholder="Enter wallet address" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Refund Address (Optional)
                  </label>
                  <ModernInput icon={AlertCircle} value={refundAddress} 
                    onChange={(e) => setRefundAddress(e.target.value)} placeholder="For safety" />
                </div>
                
                <div className="flex gap-4">
                  <GradientButton variant="primary" disabled={!canQuote} loading={loading} 
                    onClick={handleQuote} icon={TrendingUp} className="flex-1">
                    Get Quote
                  </GradientButton>
                  <GradientButton variant="outline" onClick={handleReset} icon={RefreshCw}>
                    Reset
                  </GradientButton>
                </div>
              </div>
            </GlassCard>
            
            {quote && !shift && (
              <GlassCard className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Quote Details</h3>
                  {timeLeft && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border-2 border-yellow-500/50 rounded-xl text-yellow-400 font-bold">
                      <Timer className="h-5 w-5" />
                      {timeLeft}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-6 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-2 border-emerald-500/30 rounded-2xl mb-6">
                  <div>
                    <div className="text-xs text-gray-400 mb-2">Send</div>
                    <div className="text-3xl font-black text-emerald-400">{quote.depositAmount}</div>
                    <div className="text-sm text-gray-400">{depositCoin} ({depositNetwork})</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-2">Receive</div>
                    <div className="text-3xl font-black text-cyan-400">{quote.settleAmount}</div>
                    <div className="text-sm text-gray-400">{settleCoin} ({settleNetwork})</div>
                  </div>
                </div>
                
                <GradientButton variant="primary" loading={loading} onClick={handleCreateShift} 
                  icon={Send} className="w-full">
                  Create Shift & Get Address
                </GradientButton>
              </GlassCard>
            )}
            
            {shift && (
              <GlassCard className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                    Shift Created!
                  </h3>
                  {shiftStatus && <StatusBadge status={shiftStatus.status} />}
                </div>
                
                {qrDataUrl && (
                  <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6 flex justify-center">
                    <img src={qrDataUrl} alt="QR" className="w-64 h-64 rounded-2xl" />
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="p-6 bg-slate-800/50 border-2 border-slate-700 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold flex items-center gap-2">
                        <Send className="h-4 w-4 text-emerald-400" />
                        Deposit Address ({depositNetwork})
                      </span>
                      <button onClick={() => copyToClipboard(shift.depositAddress)} 
                        className="p-2 hover:bg-slate-700 rounded-lg transition-all">
                        <Copy className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="font-mono text-sm break-all bg-black/50 p-4 rounded-xl mb-4">
                      {shift.depositAddress}
                    </div>
                    
                    {shift.depositAmount && (
                      <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                        <span className="text-sm text-gray-400">⚠️ Exact Amount Required</span>
                        <div className="text-right">
                          <div className="font-bold text-lg text-emerald-400">
                            {shift.depositAmount} {shift.depositCoin?.toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-500">Must be exact!</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {shift.id && (
                    <a href={`https://sideshift.ai/orders/${shift.id}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all">
                      <ExternalLink className="h-5 w-5" />
                      Track on SideShift.ai
                    </a>
                  )}
                  
                  {shiftStatus?.status === 'settled' && shiftStatus.settleHash && (
                    <div className="p-6 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                        <span className="font-bold text-emerald-400">Transaction Complete!</span>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">Settlement TX:</div>
                      <div className="font-mono text-xs break-all bg-black/50 p-3 rounded-lg">
                        {shiftStatus.settleHash}
                      </div>
                    </div>
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
                  { icon: Sparkles, text: `${uniqueCoins.length}+ Cryptocurrencies`, desc: "Any major coin" },
                  { icon: Network, text: "40+ Networks", desc: "All major blockchains" },
                  { icon: Zap, text: "Lightning Fast", desc: "Under 5 minutes" },
                  { icon: ShieldCheck, text: "Secure & Safe", desc: "Non-custodial" },
                  { icon: Globe, text: "Global Access", desc: "No restrictions" }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all">
                    <item.icon className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-white mb-1">{item.text}</div>
                      <div className="text-sm text-gray-400">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </GlassCard>
            
            <GlassCard className="mt-8">
              <h3 className="text-xl font-bold mb-6">How It Works</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Select Coins", desc: "Choose coin + network" },
                  { step: "2", title: "Enter Details", desc: "Amount and address" },
                  { step: "3", title: "Get Quote", desc: "15 min valid rate" },
                  { step: "4", title: "Send & Receive", desc: "Exact amount" }
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
