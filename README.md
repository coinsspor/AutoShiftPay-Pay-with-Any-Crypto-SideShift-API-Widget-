# 🚀 AutoShiftPay - Cross-Chain Crypto Swap Platform

![AutoShiftPay](https://img.shields.io/badge/SideShift.ai-Buildathon-00D9FF?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js)

**Swap any crypto to any crypto** - A professional, non-custodial cryptocurrency exchange platform powered by SideShift.ai API.

🌐 **Live Demo:** [autoshiftpay.coinsspor.com](https://autoshiftpay.coinsspor.com)

---

## ✨ Features

### 🎯 Core Functionality
- **195+ Cryptocurrencies** - Support for all major coins and tokens
- **40+ Networks** - Multi-chain support (Ethereum, BSC, Polygon, Arbitrum, Optimism, etc.)
- **Fixed Rate Swaps** - Lock in rates for up to 15 minutes
- **Real-time Status Tracking** - Live updates every 10 seconds
- **QR Code Generation** - Easy mobile deposits
- **One-Click Copy** - Quick address copying

### 💎 Advanced Features
- **Wallet Integration** - RainbowKit with MetaMask, WalletConnect, Coinbase Wallet
- **Quote Expiration Timer** - Visual countdown for fixed rates
- **Refund Address** - Optional safety net for failed transactions
- **Status Badges** - Clear visual indicators (waiting/processing/settled/refund/expired)
- **Toast Notifications** - Real-time feedback for user actions
- **Network Selection** - Granular control over deposit and settlement networks

### 🎨 UI/UX
- **Modern Design** - Glass morphism and gradient effects
- **Animated Background** - Interactive particle system
- **Fully Responsive** - Optimized for mobile and desktop
- **Dark Theme** - Easy on the eyes
- **Smooth Animations** - Powered by Framer Motion

---

## 🏗️ Architecture
```
autoshiftpay-professional/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx       # Main application component
│   │   └── index.css     # Tailwind CSS styles
│   ├── public/           # Static assets
│   └── package.json
│
└── server/               # Express.js backend
    ├── server.js         # API server
    ├── .env.example      # Environment variables template
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- SideShift.ai account (for API access)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/autoshiftpay.git
cd autoshiftpay
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your credentials
nano .env
```

**Required Environment Variables:**
```env
PORT=4455
SIDESHIFT_BASE=https://sideshift.ai/api/v2
SIDESHIFT_SECRET=your_sideshift_secret_key
AFFILIATE_ID=your_affiliate_id
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Run Development Servers

**Backend:**
```bash
cd server
npm start
# or with PM2
pm2 start server.js --name autoshiftpay-server
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Visit: `http://localhost:5173`

---

## 📦 Production Deployment

### Using PM2

**Backend:**
```bash
cd server
pm2 start server.js --name autoshiftpay-server
```

**Frontend (build first):**
```bash
cd frontend
npm run build
pm2 serve dist 5173 --name autoshiftpay-frontend --spa
```

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:4455;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 API Endpoints

### Backend API
- `GET /api/health` - Health check
- `GET /api/coins` - Get all supported coins
- `POST /api/quote` - Create a quote
- `POST /api/shift/fixed` - Create fixed rate shift
- `GET /api/shifts/:id` - Get shift status

### Example Quote Request
```javascript
POST /api/quote
Content-Type: application/json

{
  "depositCoin": "btc",
  "depositNetwork": "bitcoin",
  "settleCoin": "eth",
  "settleNetwork": "ethereum",
  "depositAmount": "0.001"
}
```

---

## 🎯 How It Works

1. **Select Coins & Networks** - Choose what you're sending and receiving
2. **Get Quote** - Request a real-time exchange rate (valid for 15 minutes)
3. **Create Shift** - Lock in the rate and get a deposit address
4. **Send Crypto** - Transfer the exact amount to the provided address
5. **Receive** - Get your swapped crypto automatically

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI framework
- **Vite 5** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **RainbowKit** - Wallet connection
- **Wagmi** - Ethereum interactions
- **Lucide React** - Icons
- **QRCode** - QR generation

### Backend
- **Node.js 20** - Runtime
- **Express** - Web framework
- **node-fetch** - HTTP client
- **CORS** - Cross-origin support
- **dotenv** - Environment variables

---

## 🔒 Security Features

- **Non-custodial** - Never holds user funds
- **No registration** - Privacy-focused
- **Refund protection** - Optional refund addresses
- **Rate limiting** - DDoS protection
- **HTTPS only** - Encrypted connections

---

## 📊 Statistics

- **195+ Supported Coins**
- **40+ Blockchain Networks**
- **<5 Minute** Average Swap Time
- **15 Minute** Quote Validity
- **24/7** Automated Processing

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is built for the **SideShift.ai Buildathon**.

---

## 🙏 Acknowledgments

- **SideShift.ai** - Providing the excellent swap API
- **RainbowKit** - Wallet connection infrastructure
- **Tailwind CSS** - Beautiful styling system
- **React Community** - Amazing ecosystem

---

## 📞 Support

- **Website:** [autoshiftpay.coinsspor.com](https://autoshiftpay.coinsspor.com)
- **SideShift.ai Docs:** [sideshift.ai/api/docs](https://sideshift.ai/api/docs)
- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/autoshiftpay/issues)

---

## 🎉 Built for SideShift.ai Buildathon

**Affiliate ID:** FLnzAru50

Made with ❤️ for the crypto community
