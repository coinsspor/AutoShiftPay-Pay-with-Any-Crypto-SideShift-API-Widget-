# AutoShiftPay — Pay with Any Crypto (SideShift API Widget)

AutoShiftPay is a **React-based payment widget** that lets *any website accept payments in any crypto*.
Under the hood, it integrates with the **SideShift API** (via a small Node/Express proxy) to fetch pairs/quotes
and (optionally) create shifts. It ships with a **demo (mock) mode** so you can run it without credentials, then
switch to live mode by adding your API key.

---

## ✨ Features
- React + Vite + Tailwind UI with animated, modern design
- Payment form → generates a **payment link + QR** and live status UI
- **Express proxy** to call SideShift API safely (avoids CORS, hides secrets)
- **Mock mode** if `SIDESHIFT_SECRET` is not set (great for hackathon demos)
- Clean, documented code with environment-driven config

---

## 🚀 Quick Start

### 1) Install deps
```bash
cd server && npm i
cd ../frontend && npm i
```

### 2) Run in demo (mock) mode
In one terminal:
```bash
cd server
npm run dev
```
In another terminal:
```bash
cd frontend
npm run dev
```
- Frontend dev server: http://localhost:5173
- API proxy server:   http://localhost:4444

### 3) Switch to **live** mode (SideShift)
1. Get a SideShift API key (if required for creating shifts).
2. Create `server/.env`:
```
PORT=4444
SIDESHIFT_BASE=https://sideshift.ai/api/v2
SIDESHIFT_SECRET=YOUR_KEY_HERE   # optional; if missing, server runs in mock mode
```
3. Restart the server `npm run dev`.

> **Note:** Live endpoints used: `/pairs`, `/quote`, and `/shift` (proxied under `/api/*`). Without an API key, the server will proxy public GETs and mock POSTs so the flow remains demoable.

---

## 🧩 Environment

**Frontend (`frontend/.env` or `.env.local`):**
```
VITE_API_BASE=http://localhost:4444/api
VITE_BRAND_NAME=AutoShiftPay
VITE_DEFAULT_RECEIVE_ASSET=BTC
VITE_DEFAULT_RECEIVE_ADDRESS=bc1qexampleexampleexample0000000000000
```

**Server (`server/.env`):**
```
PORT=4444
SIDESHIFT_BASE=https://sideshift.ai/api/v2
SIDESHIFT_SECRET= (optional)
```

---

## 📦 Build (frontend)
```bash
cd frontend
npm run build
```
The static build will be in `frontend/dist`. You can serve it behind nginx and proxy `/api` to the Node server.

---

## 📝 Submission tips
- Include a short screen-recording (30–60s) showing: form → quote → QR → success.
- In README top section, explain the **value**: “any website can accept any crypto, instantly.”
- Add a couple of preset styles (light/dark).

Good luck & happy hacking!

---

## 🔐 Live Mode ENV (server/.env)
```
PORT=4444
SIDESHIFT_BASE=https://sideshift.ai/api/v2
SIDESHIFT_SECRET=your_sideshift_account_secret
AFFILIATE_ID=your_account_id
```

The server adds header `x-sideshift-secret` and calls:
- `POST /api/quote` → proxies to `POST /v2/quotes`
- `POST /api/shift` → proxies to `POST /v2/shifts/fixed`
- `GET /api/shifts/:id` → proxies to `GET /v2/shifts/{id}`


Deployed domain example: autoshiftpay.coinsspor.com
Follow deploy/deploy_instructions.sh to deploy on Ubuntu.
