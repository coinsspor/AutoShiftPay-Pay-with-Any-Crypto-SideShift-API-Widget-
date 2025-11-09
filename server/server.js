import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4455;
const SIDESHIFT_BASE = "https://sideshift.ai/api/v2";
const SIDESHIFT_SECRET = process.env.SIDESHIFT_SECRET;
const AFFILIATE_ID = process.env.AFFILIATE_ID;

function getUserIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || 
         req.headers['x-real-ip'] || "1.1.1.1";
}

async function sideshiftAPI(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    "x-sideshift-secret": SIDESHIFT_SECRET,
    "x-user-ip": options.userIP || "1.1.1.1"
  };
  const response = await fetch(`${SIDESHIFT_BASE}${endpoint}`, {
    method: options.method || "GET",
    headers,
    ...(options.body ? { body: JSON.stringify(options.body) } : {})
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API Error: ${response.status}`);
  }
  return await response.json();
}

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/coins", async (req, res) => {
  try {
    const data = await sideshiftAPI("/coins");
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/quote", async (req, res) => {
  const { depositCoin, depositNetwork, settleCoin, settleNetwork, depositAmount } = req.body;
  try {
    const body = {
      depositCoin: String(depositCoin || "").toLowerCase(),
      depositNetwork: depositNetwork,  // Frontend'den gelen network'ü direkt kullan
      settleCoin: String(settleCoin || "").toLowerCase(),
      settleNetwork: settleNetwork,     // Frontend'den gelen network'ü direkt kullan
      depositAmount: String(depositAmount),
      affiliateId: AFFILIATE_ID
    };
    console.log("Quote request:", body);
    const data = await sideshiftAPI("/quotes", { method: "POST", body, userIP: getUserIP(req) });
    res.json(data);
  } catch (e) {
    console.error("Quote error:", e.message);
    res.status(400).json({ error: e.message });
  }
});

app.post("/api/shift/fixed", async (req, res) => {
  const { quoteId, settleAddress, refundAddress } = req.body;
  try {
    const body = { 
      quoteId, 
      settleAddress, 
      affiliateId: AFFILIATE_ID,
      ...(refundAddress ? { refundAddress } : {}) 
    };
    const data = await sideshiftAPI("/shifts/fixed", { method: "POST", body, userIP: getUserIP(req) });
    res.json(data);
  } catch (e) {
    console.error("Fixed shift error:", e.message);
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/shifts/:id", async (req, res) => {
  try {
    const data = await sideshiftAPI(`/shifts/${encodeURIComponent(req.params.id)}`);
    res.json(data);
  } catch (e) {
    res.status(404).json({ error: "Shift not found" });
  }
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   AutoShiftPay Pro v5.0 - FIXED!       ║
║   Port: ${PORT}                        ║
║   Affiliate: ${AFFILIATE_ID}           ║
║   Network mapping: REMOVED ✓           ║
╚════════════════════════════════════════╝
  `);
});
