# AutoShiftPay – Pay with Any Crypto (SideShift API Widget)

<div align="center">
 <img width="200" height="200" alt="autoshiftpaylogo" src="https://github.com/user-attachments/assets/a07b55b6-46f6-4a38-959e-fa6795401b54" />

  
  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
  [![SideShift API](https://img.shields.io/badge/SideShift-API%20v2-orange)](https://sideshift.ai/api)
</div>

## 🚀 Overview

AutoShiftPay is a **React-based payment widget** that lets *any website accept payments in any cryptocurrency*. Built for the SideShift.ai Buildathon, it integrates seamlessly with the **SideShift API** to enable instant cross-chain swaps, allowing merchants to receive payments in their preferred cryptocurrency regardless of what the customer wants to pay with.

### 🎯 Key Value Proposition
- **Accept 200+ cryptocurrencies** across 40+ blockchain networks
- **Receive in your preferred asset** - automatic conversion handled by SideShift
- **Zero private key exposure** - all sensitive operations on server-side
- **Instant deployment** - works out of the box with demo mode

## ✨ Features

- 🔄 **Cross-Chain Swaps**: Accept any crypto, receive in your preferred asset
- 🎨 **Modern UI**: Animated React interface with Tailwind CSS
- 🔐 **Secure Architecture**: Server-side API key management, no client-side secrets
- 📱 **QR Code Generation**: Instant payment QR codes for mobile wallets
- 👛 **Wallet Integration**: MetaMask and Keplr wallet detection (optional)
- ⚡ **Real-time Quotes**: Live exchange rates from SideShift API
- 🧪 **Demo Mode**: Test without API credentials using mock data
- 🌐 **Production Ready**: Nginx + PM2 deployment configurations included

## 🖼️ Screenshots

<img width="400" height="300" alt="image" src="https://github.com/user-attachments/assets/3dca9dae-1d6c-4e4a-8d7e-fa7aaf5b6736" />


## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **API Integration**: SideShift API v2
- **Deployment**: PM2, Nginx, Let's Encrypt SSL
- **Tools**: QRCode generation, Real-time status polling

## 📦 Project Structure

```
autoshiftpay/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   └── index.css      # Tailwind styles
│   ├── public/
│   │   └── logo.png       # AutoShiftPay logo
│   └── package.json
├── server/                 # Express.js backend
│   ├── server.js          # API proxy server
│   ├── .env.example       # Environment variables template
│   └── package.json
├── deploy/                 # Deployment configurations
│   ├── nginx_autoshiftpay.conf
│   └── shiftpay-server.service
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- SideShift API credentials (optional for live mode)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/autoshiftpay.git
cd autoshiftpay
```

### 2. Install Dependencies

**Backend Setup:**
```bash
cd server
npm install
cp .env.example .env
```

**Frontend Setup:**
```bash
cd ../frontend
npm install
cp .env.example .env
```

### 3. Configure Environment Variables

#### Backend (`server/.env`)
```env
PORT=4444
SIDESHIFT_BASE=https://sideshift.ai/api/v2
SIDESHIFT_SECRET=YOUR_SIDESHIFT_SECRET    # Optional - runs in mock mode if not set
AFFILIATE_ID=YOUR_AFFILIATE_ID            # Your SideShift account ID

# Merchant receive addresses (examples)
MERCHANT_BTC=bc1qexample000000000000000000000000000000
MERCHANT_ETH=0x0000000000000000000000000000000000000000
MERCHANT_SOL=FzExampleSolanaAddressExample1111111111111
MERCHANT_USDT_NETWORK=ERC20
MERCHANT_USDT_ADDRESS=0x0000000000000000000000000000000000000000

DOMAIN=autoshiftpay.yourdomain.com
```

#### Frontend (`frontend/.env`)
```env
VITE_API_BASE=http://localhost:4444/api
VITE_BRAND_NAME=AutoShiftPay
VITE_DEFAULT_RECEIVE_ASSET=BTC
VITE_DEFAULT_RECEIVE_ADDRESS=bc1qexample000000000000000000000000000000
VITE_DOMAIN=localhost
VITE_DEV_PORT=5518
```

### 4. Run in Development Mode

**Start the backend server:**
```bash
cd server
npm run dev   # Runs on http://localhost:4444
```

**Start the frontend dev server:**
```bash
cd frontend
npm run dev   # Runs on http://localhost:5518
```

Visit `http://localhost:5518` to see the application.

## 🔄 Usage Flow

1. **Configure Payment**
   - Select the cryptocurrency the customer will pay with
   - Choose the cryptocurrency you want to receive
   - Enter the payment amount

2. **Get Quote**
   - Click "Get Quote" to fetch real-time exchange rates
   - Review the estimated amount you'll receive

3. **Create Payment**
   - Click "Create Payment" to generate a deposit address
   - QR code appears for easy mobile wallet scanning

4. **Complete Transaction**
   - Customer sends payment to the displayed address
   - SideShift handles the swap automatically
   - You receive funds in your preferred cryptocurrency

## 🔐 API Integration

### Mock Mode (Default)
The application starts in mock mode, perfect for testing without API credentials:
- Returns simulated quotes and addresses
- No real transactions are processed
- Ideal for UI/UX development and demos

### Live Mode
To enable live transactions:

1. Get your SideShift API credentials:
   - Visit [SideShift.ai](https://sideshift.ai)
   - Create an account and navigate to API settings
   - Copy your Private Key (used as `x-sideshift-secret`)
   - Copy your Account ID (used as `affiliateId`)

2. Update `server/.env`:
   ```env
   SIDESHIFT_SECRET=your_actual_secret_key
   AFFILIATE_ID=your_account_id
   ```

3. Restart the backend server

## 🌐 Production Deployment

### Using PM2 and Nginx

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Configure PM2:**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [{
       name: "autoshiftpay-api",
       script: "server.js",
       cwd: "/path/to/server",
       env: {
         NODE_ENV: "production",
         PORT: "4444"
       }
     }]
   }
   ```

3. **Start with PM2:**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name autoshiftpay.yourdomain.com;
       
       root /path/to/frontend/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /api/ {
           proxy_pass http://127.0.0.1:4444/api/;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

5. **Enable SSL with Let's Encrypt:**
   ```bash
   certbot --nginx -d autoshiftpay.yourdomain.com
   ```

## 🧪 API Endpoints

### Health Check
```
GET /api/health
```
Returns: `{"ok": true, "mode": "mock" | "live"}`

### Get Quote
```
GET /api/quote?depositAsset=ETH&settleAsset=BTC&amount=0.05
```
Returns quote with exchange rate and estimated settlement amount

### Create Shift
```
POST /api/shift
Body: { "quoteId": "...", "settleAddress": "..." }
```
Returns deposit address and shift details

### Check Shift Status
```
GET /api/shifts/:id
```
Returns current status of the shift

## 🎨 Customization

### Branding
- Update `VITE_BRAND_NAME` in frontend `.env`
- Replace `public/logo.png` with your logo
- Modify colors in `tailwind.config.js`

### Supported Assets
Edit the asset arrays in `frontend/src/App.jsx`:
```javascript
{["BTC","ETH","SOL","USDT","USDC","XMR","BCH","LTC"].map(...)}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 SideShift Buildathon Submission

This project was created for the SideShift.ai Buildathon, showcasing the power of the SideShift API for enabling seamless cross-chain cryptocurrency payments.

### Category Submissions
- 🔄 **Zero UI** - Invisible swaps integrated into payment flows
- 💰 **DeFi** - Cross-chain payment infrastructure
- 🤖 **AI + Automation** - Automated swap routing and optimization

## 🔗 Links

- [Live Demo](https://autoshiftpay.coinsspor.com)
- [SideShift API Documentation](https://docs.sideshift.ai/)
- [Project Website](https://autoshiftpay.coinsspor.com)

## 📧 Support

For questions or support, please open an issue on GitHub or contact the maintainers.

---

<div align="center">
  Built with ❤️ for the SideShift.ai Buildathon
</div>
