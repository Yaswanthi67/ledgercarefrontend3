# LedgerCare Frontend (Pure UI Application)

> Modern React/Vite web application for **LedgerCare** — A Blockchain-Based Transparent Charity Management System.

---

## 🌟 Key Principles & Architecture

1. **Zero MetaMask Requirement for Donors**:
   - Donors contribute directly in Indian Rupees (**INR**) using **UPI** (Google Pay, PhonePe, Paytm, BHIM, QR code).
   - No browser extensions, seed phrases, private keys, or crypto wallets are needed for regular donors.
2. **Strict Frontend Isolation**:
   - **Frontend UI only**: Pure React 18 with Vite.
   - Communicates **only** with the LedgerCare Backend API (`http://localhost:5000/api`).
   - **Zero backend server code**.
   - **Zero private keys** or wallet credentials.
   - **Zero IPFS secrets** or payment gateway secrets.
   - **Zero Hardhat** dependencies or files.

---

## 📡 Frontend-to-Backend Architecture

```
Donor / User Browser
       │  (Plain INR / UPI donation)
       ▼
LedgerCareFrontend (React + Vite)
       │  HTTP / REST API requests
       ▼
LedgerCareBackend (Express API - Port 5000)
       ├── Payment Gateway / UPI (Razorpay)
       ├── IPFS Storage (Pinata / Decentralized)
       └── Smart Contracts (Hardhat / Ethereum Node)
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
A default `.env` is pre-configured for local development:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_CHAIN_ID=31337
VITE_RPC_URL=http://127.0.0.1:8545
VITE_CHARITY_REGISTRY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_CAMPAIGN_MANAGER_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
VITE_DONATION_LEDGER_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
VITE_FUND_EVIDENCE_TRACKER_ADDRESS=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
VITE_RAZORPAY_KEY_ID=rzp_test_ledgercare_demo
```

### 3. Run Development Server
```bash
npm run dev
```
The frontend will start at **`http://localhost:5173`**.

### 4. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
ledgercare-frontend/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── .env
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Responsive header, role badge, wallet trigger
│   │   ├── Footer.jsx              # Contract addresses, network status
│   │   ├── CampaignCard.jsx        # Campaign card with progress & donate CTA
│   │   ├── CampaignProgress.jsx    # Raised vs target visualization
│   │   ├── TransactionStatus.jsx   # 8-state transaction modal
│   │   ├── EvidenceCard.jsx        # Fund usage card with IPFS & verify links
│   │   ├── AuditTimeline.jsx       # Chronological on-chain event trail
│   │   ├── DonationModal.jsx       # Interactive donation flow
│   │   ├── LoadingSpinner.jsx      # Loading states
│   │   └── Toast.jsx               # Floating notifications
│   ├── context/
│   │   └── WalletContext.jsx       # MetaMask provider, role detection, chain switch
│   ├── hooks/
│   │   ├── useWallet.js            # Wallet hook
│   │   └── useContract.js          # Ethers contract instances
│   ├── config/
│   │   └── contracts.js            # Contract ABIs, addresses, network configs
│   ├── services/
│   │   ├── blockchain.js           # Smart contract queries & data aggregation
│   │   └── ipfs.js                 # Pinata IPFS file upload & CID generation
│   ├── utils/
│   │   ├── formatters.js           # ETH, address, date formatting
│   │   └── hash.js                 # Keccak-256 hashing for files & credentials
│   ├── styles/
│   │   └── global.css              # Dark Web3 theme & glassmorphic styling
│   ├── pages/
│   │   ├── Home.jsx                # Landing page & platform metrics
│   │   ├── Campaigns.jsx           # Campaign explorer & filtering
│   │   ├── CampaignDetails.jsx     # Detail view, donation history, audit timeline
│   │   ├── DonorDashboard.jsx      # Personal donation portfolio
│   │   ├── CharityDashboard.jsx    # Campaign creation, withdrawals, evidence upload
│   │   ├── AdminDashboard.jsx      # Credential whitelister & governance
│   │   ├── DonationHistory.jsx     # Global public donation ledger
│   │   ├── EvidenceVerification.jsx# Cryptographic file verification
│   │   └── NotFound.jsx            # 404 handler
│   ├── App.jsx                     # Router configuration
│   └── main.jsx                    # Application entry point
```

---

## 🔐 Cryptographic Integrity & Evidence Verification

1. **Charity Whitelisting**:
   Charities can only register if their credential hash matches:
   $$\text{credentialHash} = \text{keccak256}(\text{abi.encode}(\text{name}, \text{regNo}, \text{email}, \text{walletAddress}))$$
   This is whitelisted on-chain by the deployer/admin via `addValidRegistrationCredential`.

2. **Evidence Hashing**:
   When a charity records expenditure, the invoice/receipt is uploaded to IPFS and hashed using **Keccak-256**. The hash is saved permanently in `FundEvidenceTracker.sol`.

3. **Auditor Verification Tool (`/verify`)**:
   Anyone can drop an invoice file into the Evidence Verifier. The application computes the file's hash locally in the browser and checks it against the smart contract. If a single byte has been modified, the app detects the tampering and displays:
   🔴 **"Evidence Does Not Match!"**

---

## 📄 License
MIT
