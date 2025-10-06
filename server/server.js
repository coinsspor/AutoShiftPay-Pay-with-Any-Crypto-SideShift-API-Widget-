import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import qs from "qs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4444;
const SIDESHIFT_BASE = process.env.SIDESHIFT_BASE || "https://sideshift.ai/api/v2";
const SIDESHIFT_SECRET = process.env.SIDESHIFT_SECRET || null; // x-sideshift-secret
const AFFILIATE_ID = process.env.AFFILIATE_ID || null;

function isMock(){ return !SIDESHIFT_SECRET; }

const networkMap = {
  BTC: "bitcoin",
  ETH: "mainnet",
  SOL: "solana",
  USDT: "mainnet", // default to ERC20; adjust as needed
  USDC: "mainnet",
  XMR: "monero",
  BCH: "bitcoincash",
  LTC: "litecoin",
};

app.get("/api/health", (req,res)=>{
  res.json({ ok: true, mode: isMock() ? "mock" : "live" });
});

app.get("/api/pairs", async (req,res)=>{
  if(isMock()){
    return res.json([{ depositAsset:"ETH", settleAsset:"BTC" }, { depositAsset:"BTC", settleAsset:"USDT" }]);
  }
  try{
    const r = await fetch(`${SIDESHIFT_BASE}/pairs`);
    const d = await r.json();
    res.json(d);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

// GET /api/quote?depositAsset=ETH&settleAsset=BTC&amount=0.05
app.get("/api/quote", async (req,res)=>{
  const { depositAsset, settleAsset, amount } = req.query;
  if(isMock()){
    const rate = 15.42; // mock
    const estimate = Number(amount||0) * rate * 0.995;
    return res.json({ mock: true, id: "mock-quote-id", rate, settleAmount: +estimate.toFixed(8) });
  }
  try{
    const body = {
      depositCoin: String(depositAsset||"").toLowerCase(),
      depositNetwork: networkMap[depositAsset] || "mainnet",
      settleCoin: String(settleAsset||"").toLowerCase(),
      settleNetwork: networkMap[settleAsset] || "mainnet",
      depositAmount: String(amount),
      settleAmount: null,
      ...(AFFILIATE_ID ? { affiliateId: AFFILIATE_ID } : {}),
    };
    const r = await fetch(`${SIDESHIFT_BASE}/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-sideshift-secret": SIDESHIFT_SECRET },
      body: JSON.stringify(body),
    });
    const d = await r.json();
    res.json(d);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

// POST /api/shift  { quoteId, settleAddress }
app.post("/api/shift", async (req,res)=>{
  const { quoteId, settleAddress } = req.body || {};
  if(isMock()){
    return res.json({
      id: "mock-shift-id",
      depositAddress: "MOCK-DEPOSIT-ADDR-123",
      status: "waiting",
      mock: true
    });
  }
  try{
    const body = {
      quoteId,
      settleAddress,
      ...(AFFILIATE_ID ? { affiliateId: AFFILIATE_ID } : {}),
    };
    const r = await fetch(`${SIDESHIFT_BASE}/shifts/fixed`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-sideshift-secret": SIDESHIFT_SECRET },
      body: JSON.stringify(body),
    });
    const d = await r.json();
    res.json(d);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

// Optional: GET /api/shifts/:id passthrough for polling
app.get("/api/shifts/:id", async (req,res)=>{
  if(isMock()){
    return res.json({ id: req.params.id, status: "processing" });
  }
  try{
    const r = await fetch(`${SIDESHIFT_BASE}/shifts/${encodeURIComponent(req.params.id)}`, {
      headers: { "x-sideshift-secret": SIDESHIFT_SECRET }
    });
    const d = await r.json();
    res.json(d);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, ()=> console.log(`ShiftPay server listening on :${PORT} (${isMock()?"mock":"live"})`));
