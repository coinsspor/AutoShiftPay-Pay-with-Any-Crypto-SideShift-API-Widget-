import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, ExternalLink, Sparkles, Wallet2, ShieldCheck, Zap, QrCode } from "lucide-react";
import QRCode from "qrcode";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4444/api";
const BRAND = import.meta.env.VITE_BRAND_NAME || "AutoShiftPay";

const Input = (props) => (
  <input
    {...props}
    className={`w-full rounded-2xl bg-neutral-900/60 border border-neutral-700 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-600 ${props.className||""}`}
  />
);

const Select = (props) => (
  <select
    {...props}
    className={`w-full rounded-2xl bg-neutral-900/60 border border-neutral-700 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-600 ${props.className||""}`}
  />
);

const Card = ({children, className=""}) => (
  <div className={`rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 shadow-xl ${className}`}>
    {children}
  </div>
);

function WalletPanel(){
  const [metamask, setMetaMask] = useState(false);
  const [keplr, setKeplr] = useState(false);
  const [ethAddress, setEthAddress] = useState("");
  const [cosmosAddress, setCosmosAddress] = useState("");

  useEffect(()=>{
    setMetaMask(!!window.ethereum);
    setKeplr(!!window.keplr);
  },[]);

  async function connectMetaMask(){
    try{
      if(!window.ethereum) return;
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setEthAddress(accounts?.[0] || "");
    }catch(e){ console.error(e); }
  }

  async function connectKeplr(){
    try{
      if(!window.keplr) return;
      // try default chain (Cosmos Hub) for demo
      await window.keplr.enable("cosmoshub-4").catch(()=>{});
      const key = await window.keplr.getKey("cosmoshub-4");
      setCosmosAddress(key?.bech32Address || "");
    }catch(e){ console.error(e); }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold flex items-center gap-2"><Wallet2 className="h-5 w-5" /> Wallet Connect</h3>
        <span className="text-xs text-gray-400">Optional</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <button onClick={connectMetaMask} className="rounded-xl px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-left">
          <div className="font-medium">MetaMask</div>
          <div className="text-xs text-gray-400">{metamask ? "Detected" : "Not found"}</div>
          {ethAddress && <div className="text-xs break-all mt-1 text-brand-500">{ethAddress}</div>}
        </button>
        <button onClick={connectKeplr} className="rounded-xl px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-left">
          <div className="font-medium">Keplr</div>
          <div className="text-xs text-gray-400">{keplr ? "Detected" : "Not found"}</div>
          {cosmosAddress && <div className="text-xs break-all mt-1 text-brand-500">{cosmosAddress}</div>}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Wallet connection is optional — shifts are server-signed with your SideShift secret and never expose private keys on the client.
      </p>
    </Card>
  );
}

export default function App(){
  const [depositAsset, setDepositAsset] = useState("ETH");
  const [settleAsset, setSettleAsset] = useState(import.meta.env.VITE_DEFAULT_RECEIVE_ASSET || "BTC");
  const [settleAddress, setSettleAddress] = useState(import.meta.env.VITE_DEFAULT_RECEIVE_ADDRESS || "");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  const canQuote = useMemo(()=> depositAsset && settleAsset && amount && Number(amount)>0, [depositAsset, settleAsset, amount]);
  const canShift = useMemo(()=> !!quote?.id && !!settleAddress, [quote, settleAddress]);

  async function handleQuote(){
    setLoading(true);
    try{
      const res = await fetch(`${API_BASE}/quote?depositAsset=${encodeURIComponent(depositAsset)}&settleAsset=${encodeURIComponent(settleAsset)}&amount=${encodeURIComponent(amount)}`);
      const data = await res.json();
      setQuote(data);
      setShift(null);
      setQrDataUrl("");
    } finally{
      setLoading(false);
    }
  }

  async function handleCreate(){
    if(!quote?.id) return;
    setLoading(true);
    try{
      const res = await fetch(`${API_BASE}/shift`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: quote.id, settleAddress })
      });
      const data = await res.json();
      setShift(data);
      if(data?.depositAddress){
        const url = await QRCode.toDataURL(String(data.depositAddress));
        setQrDataUrl(url);
      }
    } finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,246,161,0.15),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(80,120,255,0.12),transparent_35%)]" />
      <div className="relative max-w-6xl mx-auto px-6 py-10">
        {/* HERO */}
        <div className="mb-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 mb-3">
              New • Cross‑Chain Payments
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
              {BRAND}: <span className="text-emerald-400">Instant</span> Cross‑Chain Payments
            </h1>
            <p className="text-gray-400 mt-3">
              Accept any crypto on any chain. Get paid in what you want. Powered by SideShift.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#widget" className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500">Try the Widget</a>
              <a href="https://docs.sideshift.ai/" target="_blank" className="px-5 py-3 rounded-xl border border-neutral-700 hover:bg-neutral-800">API Docs</a>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div className="rounded-2xl bg-neutral-900/60 p-4 border border-neutral-800">
                <div className="text-2xl font-semibold">200+</div>
                <div className="text-xs text-gray-400">Assets</div>
              </div>
              <div className="rounded-2xl bg-neutral-900/60 p-4 border border-neutral-800">
                <div className="text-2xl font-semibold">40+</div>
                <div className="text-xs text-gray-400">Chains</div>
              </div>
              <div className="rounded-2xl bg-neutral-900/60 p-4 border border-neutral-800">
                <div className="text-2xl font-semibold">Direct</div>
                <div className="text-xs text-gray-400">To Wallet</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <img src="/logo.png" className="h-48 w-48" alt="brand" />
          </div>
        </div>

        {/* MAIN GRID */}
        <div id="widget" className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><ArrowLeftRight className="h-5 w-5" /> Payment Widget</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300">Paying with (deposit)</label>
                  <Select value={depositAsset} onChange={e=>setDepositAsset(e.target.value)}>
                    {["BTC","ETH","SOL","USDT","USDC","XMR","BCH","LTC"].map(a=>(<option key={a} value={a}>{a}</option>))}
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-300">Merchant receives (settle)</label>
                  <Select value={settleAsset} onChange={e=>setSettleAsset(e.target.value)}>
                    {["BTC","ETH","SOL","USDT","USDC"].map(a=>(<option key={a} value={a}>{a}</option>))}
                  </Select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-300">Amount to pay (deposit)</label>
                  <Input type="number" min="0" step="any" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="e.g. 0.05" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-300">Merchant {settleAsset} Address</label>
                  <Input value={settleAddress} onChange={e=>setSettleAddress(e.target.value)} placeholder="Enter receiver address" />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button disabled={!canQuote || loading} onClick={handleQuote}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Get Quote</button>
                <button disabled={!canShift || loading} onClick={handleCreate}
                  className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 disabled:opacity-50 transition-colors">Create Payment</button>
                {loading && <span className="text-sm text-gray-400">Loading…</span>}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Sparkles className="h-5 w-5" /> Quote & Status</h2>
              {!quote && <p className="text-gray-400 text-sm">Fill the form and click <b>Get Quote</b>.</p>}
              {quote && (
                <div className="space-y-3 text-sm text-gray-300">
                  <div>Quote ID: <b className="break-all">{quote.id || "mock-quote-id"}</b></div>
                  {quote.settleAmount && <div>Estimated Receive: <b>{quote.settleAmount} {settleAsset}</b></div>}
                </div>
              )}
              <div className="mt-6">
                {qrDataUrl ? (
                  <div className="space-y-2">
                    <img src={qrDataUrl} alt="payment QR" className="h-56 w-56 bg-white p-2 rounded-xl" />
                    <p className="text-xs text-gray-400">Scan with your wallet to send to the deposit address.</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">After <b>Create Payment</b>, the deposit address QR will appear here.</div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <WalletPanel />
            <Card>
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Why {BRAND}?</h3>
              <ul className="text-sm text-gray-300 list-disc list-inside space-y-2">
                <li>Accept any crypto, receive in your preferred asset.</li>
                <li>Server-side secret — no private keys in the browser.</li>
                <li>Works with MetaMask & Keplr (optional).</li>
                <li>Direct-to-wallet with SideShift liquidity.</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2"><Zap className="h-5 w-5" /> How it works</h3>
              <ol className="text-sm text-gray-300 list-decimal list-inside space-y-2">
                <li>Enter amount and assets.</li>
                <li>Get a quote and confirm.</li>
                <li>Scan QR and pay to deposit address.</li>
                <li>We monitor the shift and settle to your address.</li>
              </ol>
            </Card>
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-gray-500">© {new Date().getFullYear()} {BRAND}. Not affiliated with SideShift.ai.</footer>
      </div>
    </div>
  );
}
